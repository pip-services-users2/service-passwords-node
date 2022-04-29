import { PasswordsMemoryPersistence } from '../../src/persistence/PasswordsMemoryPersistence';
import { PasswordsPersistenceFixture } from './PasswordsPersistenceFixture';

suite('PasswordsMemoryPersistence', ()=> {
    let persistence: PasswordsMemoryPersistence;
    let fixture: PasswordsPersistenceFixture;
    
    setup(async () => {
        persistence = new PasswordsMemoryPersistence();
        fixture = new PasswordsPersistenceFixture(persistence);
        
        await persistence.open(null);
    });
    
    teardown(async () => {
        await persistence.close(null);
    });
        
    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});