import { PasswordsFilePersistence } from '../../src/persistence/PasswordsFilePersistence';
import { PasswordsPersistenceFixture } from './PasswordsPersistenceFixture';

suite('PasswordsFilePersistence', ()=> {
    let persistence: PasswordsFilePersistence;
    let fixture: PasswordsPersistenceFixture;
    
    setup(async () => {
        persistence = new PasswordsFilePersistence('./data/passwords.test.json');

        fixture = new PasswordsPersistenceFixture(persistence);
        
        await persistence.open(null);
        await persistence.clear(null);
    });
    
    teardown(async () => {
        await persistence.close(null);
    });
        
    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });
});