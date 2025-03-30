import {retrieveAllData, runExample, testBagQueries, testDatabaseOperations, testEstablishmentQueries} from './services/dataService.mjs';

function main(){
    // Uncomment the function you want to run
    
    // retrieveAllData(); // rembember to add retrieveAllData in import
    
    // To test recently added functions
    // testDatabaseOperations();
    // runExample();    

    // testEstablishmentQueries();
    testBagQueries();


}

main();