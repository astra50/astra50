package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"io/fs"
	"log"
	"slices"
	"strings"

	"github.com/astra50/astra50/alice/internal/generate"

	. "github.com/dave/jennifer/jen"
)

const path = "sql.gen.go"

func main() {
	log.Printf("Generating %s", path)

	files, err := parser.ParseDir(token.NewFileSet(), ".", func(info fs.FileInfo) bool {
		return strings.HasSuffix(info.Name(), ".sql.go")
	}, parser.AllErrors)
	if err != nil {
		log.Fatal(err)
	}

	f := NewFile("sql")
	f.HeaderComment(generate.GeneratedBy())

	f.ImportName("github.com/jackc/pgx/v5", "pgx")
	f.ImportName("github.com/jackc/pgx/v5/pgtype", "pgtype")

	for _, fp := range files {
		v := newVisitor()
		ast.Walk(v, fp)

		slices.SortFunc(v.methods, func(a, b method) int {
			return strings.Compare(a.name, b.name)
		})

		for _, m := range v.methods {
			f.Func().
				Id(m.name).
				ParamsFunc(func(g *Group) {
					g.Id("ctx").Qual("context", "Context")

					if m.arg != "" {
						g.Id("arg").Id(m.arg)
					}
				}).
				ParamsFunc(func(g *Group) {
					g.Id(m.result)

					if m.result != "error" {
						g.Error()
					}
				}).
				BlockFunc(func(g *Group) {
					g.Return(
						Id("New").
							Call(Id("FromContext").Call(Id("ctx"))).
							Dot(m.name).
							CallFunc(func(g *Group) {
								g.Id("ctx")

								if m.arg != "" {
									g.Id("arg")
								}
							}),
					)
				}).
				Line()
		}
	}

	if err := f.Save(path); err != nil {
		panic(err)
	}
}

type visitor struct {
	methods []method
}

type method struct {
	name   string
	arg    string
	result string
}

func newVisitor() *visitor {
	return &visitor{
		methods: make([]method, 0, 10),
	}
}

func (v *visitor) Visit(n ast.Node) ast.Visitor {
	switch d := n.(type) {
	case *ast.FuncDecl:
		var arg string

		listLen := len(d.Type.Params.List)
		if listLen > 1 {
			switch t := d.Type.Params.List[listLen-1].Type.(type) {
			case *ast.Ident:
				arg = t.Name
			case *ast.SelectorExpr:
				arg = t.X.(*ast.Ident).Name + "." + t.Sel.String()
			default:
				panic(t)
			}
		}

		var result string
		switch t := d.Type.Results.List[0].Type.(type) {
		case *ast.Ident:
			result = t.Name
		case *ast.SelectorExpr:
			result = fmt.Sprintf("%s.%s", t.X, t.Sel)
		case *ast.ArrayType:
			switch t := t.Elt.(type) {
			case *ast.Ident:
				result = "[]" + t.Name
			default:
				panic(t)
			}
		default:
			panic(t)
		}

		v.methods = append(v.methods, method{
			name:   d.Name.String(),
			arg:    arg,
			result: result,
		})
	}

	return v
}
