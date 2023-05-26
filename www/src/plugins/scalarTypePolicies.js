"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toImp = exports.isScalarType = exports.isObjectType = exports.plugin = void 0;
const graphql_1 = require("graphql");
const ts_poet_1 = require("ts-poet");
/** Generates field policies for user-defined types, i.e. Date handling. */
const plugin = async (schema, _, config) => {
    const { scalarTypePolicies = {} } = config || {};
    function isScalarWithTypePolicy(f) {
        let type = f.type;
        if ((0, graphql_1.isNonNullType)(type)) {
            type = type.ofType;
        }
        return isScalarType(type) && scalarTypePolicies[type.name] !== undefined;
    }
    const content = (0, ts_poet_1.code) `
    export const scalarTypePolicies = {
      ${Object.values(schema.getTypeMap())
        .filter(isObjectType)
        .filter((t) => !t.name.startsWith("__"))
        .filter((t) => Object.values(t.getFields()).some(isScalarWithTypePolicy))
        .map((type) => {
        return (0, ts_poet_1.code) `${type.name}: { fields: { ${Object.values(type.getFields())
            .filter(isScalarWithTypePolicy)
            .map((field) => {
            let type = field.type;
            if ((0, graphql_1.isNonNullType)(type)) {
                type = type.ofType;
            }
            return (0, ts_poet_1.code) `${field.name}: ${toImp(scalarTypePolicies[type.name])},`;
        })} } },`;
    })}
    };
  `.toString();
    return { content };
};
exports.plugin = plugin;
function isObjectType(t) {
    return t instanceof graphql_1.GraphQLObjectType;
}
exports.isObjectType = isObjectType;
function isScalarType(t) {
    return t instanceof graphql_1.GraphQLScalarType;
}
exports.isScalarType = isScalarType;
// Maps the graphql-code-generation convention of `@src/context#Context` to ts-poet's `Context@@src/context`.
function toImp(spec) {
    if (!spec) {
        return undefined;
    }
    const [path, symbol] = spec.split("#");
    return (0, ts_poet_1.imp)(`${symbol}@${path}`);
}
exports.toImp = toImp;
