package generate

import (
	"fmt"
	"os"
	"strings"
)

func GeneratedBy() string {
	var sb strings.Builder
	sb.Grow(100)

	sb.WriteString("generate")

	program := os.Args[0]
	sb.WriteString(program[strings.LastIndex(program, "/"):])

	flags := strings.Join(os.Args[1:], " ")
	if flags != "" {
		sb.WriteString(" " + flags)
	}

	return fmt.Sprintf(`Code generated by "%s"; DO NOT EDIT.`, sb.String())
}
