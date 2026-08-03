import { dbEnvMap } from '../../common-service-bench/env-config.js';

const envK8sHostMap = {
    df2_dev_sg: {
        url: 'api-skez410-55313.df-3190.dev.azure.scbdev.net'
    },
    df2_sit_sg: {
        url: 'api-skez410-55313.df-3190.dev.azure.scbdev.net'
    },
    df2_uat_sg: {
        url: 'api-skez412-55313.df-3190.dev.azure.scbdev.net'
    },
    df2_qa_sg: {
        url: 'api-skez412-55313.df-3190.dev.azure.scbdev.net'
    },
    gdcw2_uat_ark: {
        url: 'api-skek408-ark-50933.ske.standardchartered.com'
    },
    ct1_prod_hk: {
        url: 'api.sked009.55313.hk.app.standardchartered.com'
    },
    ct1_prod_sg: {
        url: 'api.sked009.55313.sg.app.standardchartered.com'
    },
    gdcw2_prod_ark: {
        url: 'api-skeu408-ark-55313.ske.standardchartered.com'
    },
    gdcw2_prod_watford: {
        url: 'api-skeu408-wat-55313.ske.standardchartered.com'
    },
    ct1_dev_hk: {
        host: 'api-sket410-stg.55313.app.standardchartered.com'
    },
    ct1_sit_hk: {
        url: 'api-sket410-stg.55313.app.standardchartered.com'
    },
    ct1_uat_hk: {
        url: 'api-sket410-stg.55313.app.standardchartered.com'
    },
    ct1_qa_hk: {
        url: 'api-sket410-stg.55313.app.standardchartered.com'
    },
    cn1_uat_sct: {
        type: 'UAT',
        url: 'api-sken002-cnp-50933.ske.standardchartered.com'
    },
    cn1_prod_uct: {
        url: 'api-skec002-cnp-50933.ske.standardchartered.com'
    },
    cn1_prod_wgq: {
        url: 'api-skec002-cnd-50933.ske.standardchartered.com'
    }
}

const temporalDBEnvMap = {
    ...dbEnvMap,
    ct1_prod_hk: {
        dbHost: 'hkiwnrsm29hyp00.hk.standardchartered.com',
        dbPort: '6524',
        dbHcvPath: 'scb/hkiwnrsm29hyp00.hk.standardchartered.com/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    ct1_prod_sg: {
        dbHost: 'sg5wnrsm29hyp00.sg.standardchartered.com',
        dbPort: '6524',
        dbHcvPath: 'scb/sg5wnrsm29hyp00.sg.standardchartered.com/static-creds/postgres_sb-55313-<%= componentId %>-app'
    }
}

export {
    envK8sHostMap,
    temporalDBEnvMap
}