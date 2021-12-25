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
        checkAuth: () => {
            return keycloak.authenticated && keycloak.token
                ? Promise.resolve()
                : Promise.reject('Failed to obtain access token.')
        },
        logout: () => 'development' === process.env.NODE_ENV ? Promise.resolve() : keycloak.logout(),
        getIdentity: () => {
            if (keycloak.token) {
                const decoded = decode(keycloak.token)
                const id = decoded.sub as Identifier
                const fullName = decoded.name

                return Promise.resolve({id, fullName})
            }
            return Promise.reject('Failed to get identity')
        },
        getPermissions: () => {
            let isGrantAccess = false

            if (keycloak.token) {
                const decoded = decode(keycloak.token)
                const roles = decoded.realm_access.roles

                isGrantAccess = roles.includes('admin') || roles.includes('government')
            }

            return Promise.resolve(isGrantAccess)
        },
    }
}

export default useAuthProvider
