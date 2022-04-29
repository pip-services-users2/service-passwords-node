# Passwords Microservice

This is a password authentication microservice from Pip.Services library. 
* Sets user passwords and authenticate
* Safely change passwords
* Reset and recover passwords via emails

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca
* Persistence: Flat Files, MongoDB

This microservice has optional dependencies on the following microservices:
- [service-activities](https://github.com/pip-services-users2/service-activities-nodex) - to log user activities
- [service-email](https://github.com/pip-services-users2/service-email-nodex) - to send email notifications to users

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-users2/client-passwords-nodex)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
  - [Seneca Version 1](doc/SenecaProtocolV1.md)

##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
interface IPasswordsV1 {
    setPassword(correlationId: string, userId: string, password: string): Promise<void>;

    deletePassword(correlationId: string, userId: string): Promise<void>;

    authenticate(correlationId: string, userId: string, password: string): Promise<boolean>;

    changePassword(correlationId: string, userId: string, oldPassword: string, newPassword: string): Promise<void>;

    resetPassword(correlationId: string, userId: string, code: string, password: string): Promise<void>;

    recoverPassword(correlationId: string, userId: string): Promise<void>;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-users2/service-passwords-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 

Example of microservice configuration
```yaml
---
- descriptor: "service-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-passwords:persistence:file:default:1.0"
  path: "./data/passwords.json"

- descriptor: "service-passwords:controller:default:default:1.0"
  options:
      lock_timeout: 1800000 # 30 mins
      attempt_timeout: 60000 # 1 min
      attempt_count: 4 # 4 times
      rec_expire_timeout: 7200000 # 2 hours
      lock_enabled: false # set to TRUE to enable locking logic
      magic_code: null # Universal code

- descriptor: "service-passwords:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-passwords-nodex": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
let sdk = new require('client-passwords-nodex');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
let config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.PasswordsHttpClientV1(config);

// Connect to the microservice
try {
    await client.open(null);
    // Work with the microservice
    ...
}
catch (err) {
    console.error('Connection to the microservice failed');
    console.error(err);
}
```

Now the client is ready to perform operations
```javascript
// Set a password for a new user
await client.setPassword(
    null,
    user_id: '123',
    password: 'test123',
);
```

```javascript
// Authenticate user
let authenticated = await client.authenticate(
    null,
    '123',
    'test123'
);
```    

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.
