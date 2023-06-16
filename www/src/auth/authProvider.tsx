import {useKeycloak} from '@react-keycloak/web'
import jwt_decode from 'jwt-decode'
import {KeycloakTokenParsed} from 'keycloak-js'
import {AuthProvider, Identifier} from 'react-admin'

const useAuthProvider = (): AuthProvider => {
    const {keycloak} = useKeycloak()

    return {
        login: () => keycloak.login(),
        checkError: () => Promise.resolve(),
        checkAuth: () => keycloak.authenticated && keycloak.token
            ? Promise.resolve()
            : Promise.reject({message: false, redirectTo: '/'}),
        logout: () => keycloak.authenticated ? keycloak.logout() : Promise.resolve(),
        getIdentity: () => {
            if (keycloak.token) {
                const decoded = jwt_decode<KeycloakTokenParsed>(keycloak.token)
                const id = decoded.sub as Identifier
                const fullName = decoded.name

                return Promise.resolve({id, fullName})
            }

            return Promise.reject({message: false})
        },
        getPermissions: () => {
            if (keycloak.token) {
                return Promise.resolve(jwt_decode<KeycloakTokenParsed>(keycloak.token).realm_access!!.roles)
            }

            return Promise.resolve([])
        },
    }
}

export default useAuthProvider
