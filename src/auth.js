import {
  CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute
} from "amazon-cognito-identity-js";

const pool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_USER_POOL_ID?.trim(),
  ClientId: import.meta.env.VITE_CLIENT_ID?.trim(),
});


export const signUp = (email, password, name) =>
  new Promise((resolve, reject) => {
    const attrs = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: name }),
    ];
    pool.signUp(email, password, attrs, null, (err, res) =>
      err ? reject(err) : resolve(res));
  });

export const confirmSignUp = (email, code) =>
  new Promise((resolve, reject) => {
    new CognitoUser({ Username: email, Pool: pool })
      .confirmRegistration(code, true, (err, r) => (err ? reject(err) : resolve(r)));
  });

export const signIn = (email, password) =>
  new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    const details = new AuthenticationDetails({ Username: email, Password: password });
    user.authenticateUser(details, { onSuccess: resolve, onFailure: reject });
  });

export const signOut = () => {
  const u = pool.getCurrentUser();
  if (u) u.signOut();
};

export const getSession = () =>
  new Promise((resolve) => {
    const u = pool.getCurrentUser();
    if (!u) return resolve(null);
    u.getSession((err, s) => resolve(err || !s || !s.isValid() ? null : s));
  });

export const getToken = async () => {
  const s = await getSession();
  return s ? s.getIdToken().getJwtToken() : null;
};

export const getEmail = async () => {
  const s = await getSession();
  return s ? s.getIdToken().payload.email : null;
};

export const getIsOwner = async () => {
  const s = await getSession();
  if (!s) return false;
  const groups = s.getIdToken().payload["cognito:groups"] || [];
  return groups.includes("owners");
};