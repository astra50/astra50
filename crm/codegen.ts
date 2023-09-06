import {type CodegenConfig} from '@graphql-codegen/cli'

const config: CodegenConfig = {
    config: {
        avoidOptionals: true,
        scalars: {
            timestamp: 'import("dayjs").Dayjs',
            timestamptz: 'import("dayjs").Dayjs',
            uuid: 'string',
            numeric: 'number',
        },
        scalarTypePolicies: {
            timestamp: './components/dayjs#dateTypePolicy',
            timestamptz: './components/dayjs#dateTypePolicy',
        },
        namingConvention: {
            typeNames: 'change-case-all#pascalCase',
            typeValues: 'change-case-all#pascalCase',
            enumValues: 'change-case-all#pascalCase',
        },
    },
    generates: {
        'src/types.ts': {
            schema: './graphql.schema.json',
            plugins: ['typescript', './src/plugins/scalarTypePolicies.js'],
        },
        './src': {
            schema: './graphql.schema.json',
            documents: ['./src/**/*.graphql'],
            preset: 'near-operation-file',
            presetConfig: {
                folder: '__gql-generated',
                extension: '.generated.ts',
                baseTypesPath: 'types.ts',
            },
            plugins: ['typescript-operations', 'typescript-react-apollo'],
        },
    },
}

export default config
