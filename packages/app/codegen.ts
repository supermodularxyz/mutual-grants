import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	overwrite: true,
	config: {
		namingConvention: {
			typeNames: "change-case-all#pascalCase",
			enumValues: "change-case-all#upperCase",
			transformUnderscore: true
		},
		useTypeImports: true,
	},
  generates: {
		'gql/types.generated.ts': {
			schema: 'schema.graphql',
			documents: 'graphql/userProjects.gql',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        scalars: {
					BigDecimal: 'number',
          BigInt: 'number',
          Bytes: 'number',
        },
				declarationKind: {
					type: 'interface',
					input: 'interface'
				},
        enumsAsTypes: true,
        withHooks: true,
      },
    },
  },
}
export default config
