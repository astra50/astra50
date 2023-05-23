import {type CodegenConfig} from '@graphql-codegen/cli'

const schemaUrl = process.env.GRAPHQL_ENDPOINT ?? 'http://hasura/v1/graphql'

console.log(schemaUrl)

const config: CodegenConfig = {
    schema: [
        {
            [`${schemaUrl}`]: {
                headers: {
                    'X-Hasura-Admin-Secret': 'admin',
                    'X-Hasura-Role': 'anonymous',
                },
            },
        },
    ],
    documents: ['./**/*.graphql'],
    config: {
        avoidOptionals: {
            field: true,
        },
        scalars: {
            timestamp: 'import("dayjs").Dayjs',
            timestamptz: 'import("dayjs").Dayjs',
            uuid: 'string',
            numeric: 'number',
        },
        namingConvention: {
            typeNames: 'change-case-all#pascalCase',
            typeValues: 'change-case-all#pascalCase',
            enumValues: 'change-case-all#pascalCase',
        },
    },
    generates: {
        'src/types.ts': {
            plugins: ['typescript'],
        },
        './': {
            preset: 'near-operation-file',
            presetConfig: {
                folder: '__gql-generated',
                extension: '.generated.ts',
                baseTypesPath: 'src/types.ts',
            },
            plugins: ['typescript-operations', 'typescript-react-apollo'],
        },
        './graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
}

export default config
