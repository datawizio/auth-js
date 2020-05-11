Бібліотека для роботи з сервісом авторизації.
[Diagram](https://drive.google.com/file/d/1K5TrTGxDMzU2TJbedERWXLXFw31aUgdv/view?usp=sharing])

## Install

Npm:

`npm install @datawizio/auth-js`

Yarn:

`yarn add @datawizio/auth-js`

## Приклад

```javascript
import DatawizAuth from "@datawizio/auth-js";

var a = new DatawizAuth({
  serviceUrl: "https://oauth-test.datawiz.io",
  clientId: "clientId",
  clientSecret: "clientSecret",
  redirectUrl: "redirectUrl"
});

a.init()
  .then(function (res) {
    //asd
    console.log("authorized", res);
  })
  .catch(function (e) {
    console.log(e);
  });

a.onTokenRefreshed = function (res) {
  console.log(res);
};
```

## Config

| Name             | Type   | Description                       |
| ---------------- | ------ | --------------------------------- |
| **serviceUrl**   | string | урл адреса до сервісу авторизації |
| **clientId**     | string | індентифікатор клієнта            |
| **clientSecret** | string | секрет :)                         |
| **redirectUrl**  | string | урл, куди буде йти редірект       |

## Methods

### init

Для запуску бібліотеки. Результатом буде `Promise` при успіху об'єкт з
`accessToken`

`authService.init()`

### refreshToken

Метод рефрефу токена. Визиваємо коли необхідно оновити токен. Результатом буде
`Promise` при успіху об'єкт з `accessToken`

`authService.refreshToken()`

## Events

TBD
