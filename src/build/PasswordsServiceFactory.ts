import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { PasswordsMongoDbPersistence } from '../persistence/PasswordsMongoDbPersistence';
import { PasswordsFilePersistence } from '../persistence/PasswordsFilePersistence';
import { PasswordsMemoryPersistence } from '../persistence/PasswordsMemoryPersistence';
import { PasswordsController } from '../logic/PasswordsController';
import { PasswordsCommandableHttpServiceV1 } from '../services/version1/PasswordsCommandableHttpServiceV1';
import { PasswordsCommandableGrpcServiceV1 } from '../services/version1/PasswordsCommandableGrpcServiceV1';
import { PasswordsGrpcServiceV1 } from '../services/version1/PasswordsGrpcServiceV1';

export class PasswordsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-passwords", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("service-passwords", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("service-passwords", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("service-passwords", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("service-passwords", "controller", "default", "*", "1.0");
	public static CommandableHttpServiceDescriptor = new Descriptor("service-passwords", "service", "commandable-http", "*", "1.0");
	public static CommandableGrpcServiceDescriptor = new Descriptor("service-passwords", "service", "commandable-grpc", "*", "1.0");
	public static GrpcServiceDescriptor = new Descriptor("service-passwords", "service", "grpc", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(PasswordsServiceFactory.MemoryPersistenceDescriptor, PasswordsMemoryPersistence);
		this.registerAsType(PasswordsServiceFactory.FilePersistenceDescriptor, PasswordsFilePersistence);
		this.registerAsType(PasswordsServiceFactory.MongoDbPersistenceDescriptor, PasswordsMongoDbPersistence);
		this.registerAsType(PasswordsServiceFactory.ControllerDescriptor, PasswordsController);
		this.registerAsType(PasswordsServiceFactory.CommandableHttpServiceDescriptor, PasswordsCommandableHttpServiceV1);
		this.registerAsType(PasswordsServiceFactory.CommandableGrpcServiceDescriptor, PasswordsCommandableGrpcServiceV1);
		this.registerAsType(PasswordsServiceFactory.GrpcServiceDescriptor, PasswordsGrpcServiceV1);
	}
	
}
