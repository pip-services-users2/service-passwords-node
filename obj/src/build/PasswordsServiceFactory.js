"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordsServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const PasswordsMongoDbPersistence_1 = require("../persistence/PasswordsMongoDbPersistence");
const PasswordsFilePersistence_1 = require("../persistence/PasswordsFilePersistence");
const PasswordsMemoryPersistence_1 = require("../persistence/PasswordsMemoryPersistence");
const PasswordsController_1 = require("../logic/PasswordsController");
const PasswordsHttpServiceV1_1 = require("../services/version1/PasswordsHttpServiceV1");
const PasswordsCommandableGrpcServiceV1_1 = require("../services/version1/PasswordsCommandableGrpcServiceV1");
const PasswordsGrpcServiceV1_1 = require("../services/version1/PasswordsGrpcServiceV1");
class PasswordsServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(PasswordsServiceFactory.MemoryPersistenceDescriptor, PasswordsMemoryPersistence_1.PasswordsMemoryPersistence);
        this.registerAsType(PasswordsServiceFactory.FilePersistenceDescriptor, PasswordsFilePersistence_1.PasswordsFilePersistence);
        this.registerAsType(PasswordsServiceFactory.MongoDbPersistenceDescriptor, PasswordsMongoDbPersistence_1.PasswordsMongoDbPersistence);
        this.registerAsType(PasswordsServiceFactory.ControllerDescriptor, PasswordsController_1.PasswordsController);
        this.registerAsType(PasswordsServiceFactory.HttpServiceDescriptor, PasswordsHttpServiceV1_1.PasswordsHttpServiceV1);
        this.registerAsType(PasswordsServiceFactory.CommandableGrpcServiceDescriptor, PasswordsCommandableGrpcServiceV1_1.PasswordsCommandableGrpcServiceV1);
        this.registerAsType(PasswordsServiceFactory.GrpcServiceDescriptor, PasswordsGrpcServiceV1_1.PasswordsGrpcServiceV1);
    }
}
exports.PasswordsServiceFactory = PasswordsServiceFactory;
PasswordsServiceFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "factory", "default", "default", "1.0");
PasswordsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "persistence", "memory", "*", "1.0");
PasswordsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "persistence", "file", "*", "1.0");
PasswordsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "persistence", "mongodb", "*", "1.0");
PasswordsServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "controller", "default", "*", "1.0");
PasswordsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "service", "http", "*", "1.0");
PasswordsServiceFactory.CommandableGrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "service", "commandable-grpc", "*", "1.0");
PasswordsServiceFactory.GrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-passwords", "service", "grpc", "*", "1.0");
//# sourceMappingURL=PasswordsServiceFactory.js.map