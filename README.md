Бібліотека для роботи з сервісом авторизації.
[Diagram](https://drive.google.com/file/d/1K5TrTGxDMzU2TJbedERWXLXFw31aUgdv/view?usp=sharing])

## Приклад

```javascript
const config = {
  serviceUrl: "https://oauth-test.datawiz.io",
  clientId: "client_id",
  clientSecret: "client_secret",
  redirectUrl: "redirect_url"
};

const authService = new DatawizAuth(config);

authService
  .init()
  .then(function (res) {
    console.log("authorized", res);
  })
  .catch(function (e) {
    console.log(e);
  });
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
