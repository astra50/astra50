import {useKeycloak} from '@react-keycloak/web'
import jwt_decode from 'jwt-decode'

const useAuthProvider = () => {
    const {keycloak} = useKeycloak();

    return ({
        login: () => keycloak.login(),
        checkError: () => Promise.resolve(),
        checkAuth: () => {
            return keycloak.authenticated && keycloak.token
                ? Promise.resolve()
                : Promise.reject("Failed to obtain access token.");
        },
        logout: () => keycloak.logout(),
        getIdentity: () => {
            if (keycloak.token) {
                const decoded = jwt_decode(keycloak.token);
                const id = decoded.sub
                const fullName = decoded.name
                return Promise.resolve({id, fullName});
            }
            return Promise.reject("Failed to get identity");
        },
        getPermissions: () => {
            if (keycloak.token) {
                const decoded = jwt_decode(keycloak.token);
                const roles = decoded.realm_access.roles;

                if (roles.includes('admin') || roles.includes('government')) {
                    return Promise.resolve(true);
                }
            }

            return Promise.resolve(false);
        },
    });
};

export default useAuthProvider;
