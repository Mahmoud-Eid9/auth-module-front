# Project Set up
Clone this repo then run this Command in the root directory
```npm install```
after you installed the dependencies, run this command to spin up the project
```npm run dev```

# Routes
- `/login`: login page for unauthorized users
- `/register`: register page to create a new account
- `/`: the home page that is only accessible by authorized users
- Different Rotues fallback to `/login`

# Authentication Logic
the Flow Starts with `/login`:
- `/login` returns an `accessToken` in the body and a cookie with `refreshToken`
- the `accessToken` is short lived and needs to be regenerated using the `refreshToken`

## Regenerating `accessToken`
- when the `accessToken` expires and the user makes an action the following happens
  - an authorization error is sent back from the server
  - `/auth/refresh` is called and the cookie is sent
  - a new `accessToken` and `refreshToken` are issued
  - the original action of the user is replayed

all of this is done by an Axios interceptor that you can find at `/src/api/axiosClient.ts`.
Interceptors are also used to attach the `accessToken` to requests going to the server


# Sharing the token between React and Axios
Axios lives outside of react, so the change in context state won't update the token for axios.
In order to solve that I made a token store that you can find in `/src/utils/authTokenStore.ts`,
This alongside a component `UseAuth` found in `/src/context/UseAuth.tsx` that includes an update of the `token store` inside of a `useEffect` and the context is passed in the parameters array.

this way whenever the `context(token)` is changed, the `useEffect` inside `UseAuth` will trigger an update to the `token store`,
And axios will be updated

