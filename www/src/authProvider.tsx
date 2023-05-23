import {useKeycloak} from '@react-keycloak/web'
import jwt_decode, {JwtPayload} from 'jwt-decode'
import {AuthProvider, Identifier} from 'react-admin'

interface KeycloakJwtPayload extends JwtPayload {
    name: string,
    realm_access: {
        roles: [string],
    },
}

const decode = (jwt: string): KeycloakJwtPayload => jwt_decode(jwt)

const useAuthProvider = (): AuthProvider => {
    const {keycloak} = useKeycloak()

    return {
        login: () => keycloak.login(),
        checkError: () => Promise.resolve(),
        checkAuth: (props: any) => {

            switch (props?.route) {
                case 'dashboard':
                    return Promise.resolve()
            }

            return Promise.reject({message: false})
        },
        // checkAuth: () => keycloak.authenticated && keycloak.token ? Promise.resolve() : Promise.reject('Failed to obtain access token.'),
        logout: () => 'development' === process.env.NODE_ENV ? Promise.resolve() : keycloak.logout(),
        getIdentity: () => {
            if (keycloak.token) {
                const decoded = decode(keycloak.token)
                const id = decoded.sub as Identifier
                const fullName = decoded.name

                return Promise.resolve({id, fullName})
            }

            return Promise.reject({ message: false })
        },
        getPermissions: (props: any) => {
            console.log('getPermissions', props)

            let roles: string[] = []

            if (keycloak.token) {
                roles = decode(keycloak.token).realm_access.roles
            }

            return Promise.resolve(roles)
        },
    }
}

export default useAuthProvider
