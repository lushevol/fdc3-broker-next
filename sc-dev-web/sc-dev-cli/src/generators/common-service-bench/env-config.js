const idpEnvMap = {
    df2_sit_sg: {
        authnEndpoint: 'https://sit-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://sit-api.idp.global.standardchartered.com/ns03'
    },
    df2_uat_sg: {
        authnEndpoint: 'https://uat-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    df2_qa_sg: {
        authnEndpoint: 'https://uat-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    df2_uat_uk: {
        authnEndpoint: 'https://uat-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    gdcw1_dev_ark: {
        authnEndpoint: 'https://sit-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://sit-api.idp.global.standardchartered.com/ns03'
    },
    gdcw2_uat_ark: {
        authnEndpoint: 'https://uat-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    ct1_prod_hk: {
        authnEndpoint: 'https://authn.55325.app.standardchartered.com/ns03',
        apiEndpoint: 'https://api.55325.app.standardchartered.com/ns03'
    },
    ct1_prod_sg: {
        authnEndpoint: 'https://authn.55325.app.standardchartered.com/ns03',
        apiEndpoint: 'https://api.55325.app.standardchartered.com/ns03'
    },
    gdcw1_prod_ark: {
        authnEndpoint: 'https://authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://api.idp.global.standardchartered.com/ns03'
    },
    gdcw1_prod_watford: {
        authnEndpoint: 'https://authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://api.idp.global.standardchartered.com/ns03'
    },
    gdcw2_prod_ark: {
        authnEndpoint: 'https://authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://api.idp.global.standardchartered.com/ns03'
    },
    gdcw2_prod_watford: {
        authnEndpoint: 'https://authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://api.idp.global.standardchartered.com/ns03'
    },
    ct1_dev_hk: {
        authnEndpoint: 'https://sit-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://sit-api.idp.global.standardchartered.com/ns03'
    },
    ct1_sit_hk: {
        authnEndpoint: 'https://sit-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://sit-api.idp.global.standardchartered.com/ns03'
    },
    ct1_uat_hk: {
        authnEndpoint: 'https://uat-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    ct1_qa_hk: {
        authnEndpoint: 'https://uat-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    cn1_uat_sct: {
        authnEndpoint: 'https://uat-authn-staff-idp.cn.standardchartered.com',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    cn1_prod_uct: {
        authnEndpoint: 'https://authn-staff-idp.cn.standardchartered.com',
        apiEndpoint: 'https://api-staff-idp.cn.standardchartered.com'
    },
    cn1_prod_wgq: {
        authnEndpoint: 'https://authn-staff-idp.cn.standardchartered.com',
        apiEndpoint: 'https://api-staff-idp.cn.standardchartered.com'
    },
    id1_uat_aks: {
        authnEndpoint: 'https://uat-authn.idp.global.standardchartered.com/ns03',
        apiEndpoint: 'https://uat-api.idp.global.standardchartered.com/ns03'
    },
    id1_stg_aks: {
        authnEndpoint: 'https://authn.55325.app.standardchartered.com/ns03',
        apiEndpoint: 'https://api.55325.app.standardchartered.com/ns03'
    },
    id1_prod_aks: {
        authnEndpoint: 'https://authn.55325.app.standardchartered.com/ns03',
        apiEndpoint: 'https://api.55325.app.standardchartered.com/ns03'
    }
}

const varEnvMap = {
    df2_dev_sg: {
        type: 'DEV',
        url: 'https://servicebench-dev.df-3190.dev.azure.scbdev.net'
    },
    df2_sit_sg: {
        type: 'SIT',
        url: 'https://servicebench-sit.df-3190.dev.azure.scbdev.net'
    },
    df2_uat_sg: {
        type: 'UAT',
        url: 'https://servicebench-uat.df-3190.dev.azure.scbdev.net'
    },
    df2_qa_sg: {
        type: 'QA',
        url: 'https://servicebench-qa.df-3190.dev.azure.scbdev.net'
    },
    df2_uat_uk: {
        type: 'UAT',
        url: 'https://servicebench-ark-uat.df-3190.dev.azure.scbdev.net'
    },
    gdcw1_dev_ark: {
        type: 'DEV',
        url: 'https://servicebench-dev.global.standardchartered.com'
    },
    gdcw2_uat_ark: {
        type: 'UAT',
        url: 'https://servicebench-ark-uat.global.standardchartered.com'
    },
    ct1_prod_hk: {
        type: 'PRD',
        url: 'https://servicebench.55313.app.standardchartered.com'
    },
    ct1_prod_sg: {
        type: 'PRD',
        url: 'https://servicebench.55313.app.standardchartered.com'
    },
    gdcw1_prod_ark: {
        type: 'PRD',
        url: 'https://servicebench-uk.global.standardchartered.com'
    },
    gdcw1_prod_watford: {
        type: 'PRD',
        url: 'https://servicebench-uk.global.standardchartered.com'
    },
    gdcw2_prod_ark: {
        type: 'PRD',
        url: 'https://servicebench-gdcw.global.standardchartered.com'
    },
    gdcw2_prod_watford: {
        type: 'PRD',
        url: 'https://servicebench-gdcw.global.standardchartered.com'
    },
    ct1_dev_hk: {
        type: 'DEV',
        url: 'https://servicebench-dev-stg.55313.app.standardchartered.com'
    },
    ct1_sit_hk: {
        type: 'SIT',
        url: 'https://servicebench-sit-stg.55313.app.standardchartered.com'
    },
    ct1_uat_hk: {
        type: 'UAT',
        url: 'https://servicebench-uat-stg.55313.app.standardchartered.com'
    },
    ct1_qa_hk: {
        type: 'QA',
        url: 'https://servicebench-qa-stg.55313.app.standardchartered.com'
    },
    cn1_uat_sct: {
        type: 'UAT',
        url: 'https://servicebench-sct-uat.global.standardchartered.com'
    },
    cn1_prod_uct: {
        type: 'PRD',
        url: 'https://servicebench-cn.global.standardchartered.com'
    },
    cn1_prod_wgq: {
        type: 'PRD',
        url: 'https://servicebench-cn.global.standardchartered.com'
    },
    id1_uat_aks: {
        type: 'UAT',
        url: 'https://servicebench-id-uat.global.standardchartered.com'
    },
    id1_stg_aks: {
        type: 'STG',
        url: 'https://servicebench-id-qa.global.standardchartered.com'
    },
    id1_prod_aks: {
        type: 'PRD',
        url: 'https://servicebench-id.global.standardchartered.com'
    }
}

const devEnvMap = {
    df2: [
        {
            name: 'df2_sit_sg',
            displayName: 'DF2-SIT-SG',
            extraHelmArgs: '--set internalEnvCode=sit',
            k8s_params: {
                namespacePrefix: 'sit'
            }
        },
        {
            name: 'df2_uat_sg',
            displayName: 'DF2-UAT-SG',
            extraHelmArgs: '--set internalEnvCode=uat',
            k8s_params: {
                namespacePrefix: 'uat'
            },
            dependsOn: ['df2_sit_sg']
        },
    ],
    df2_uat_uk:[
        {
            name: 'df2_uat_uk',
            extraHelmArgs: '--set internalEnvCode=uat',
            k8s_params: {
                namespacePrefix: 'uat'
            },
            displayName: 'DF2-UAT-UK'
        },
    ],
    gdcw1: [
        {
            name: 'gdcw1_dev_ark',
            displayName: 'GDCW1-DEV-ARK',
            secureFileName: '55313-NonProd-ark-dev-kubeconfig'
        }
    ],
    gdcw2: [
        {
            name: 'gdcw2_uat_ark',
            displayName: 'GDCW2-UAT-ARK',
            secureFileName: '55313-NonProd-skek408-ark-kubeconfig'
        }
    ],
    ct1_dev: [
        {
            name: 'ct1_dev_hk',
            displayName: 'CT1-DEV-HK',
            secureFileName: '55313_NonProd_sket410_kubeconfig',
            extraHelmArgs: '--set internalEnvCode=dev',
            k8s_params: {
                namespacePrefix: 'dev'
            }
        },
    ],
    ct1: [
        {
            name: 'ct1_sit_hk',
            displayName: 'CT1-SIT-HK',
            secureFileName: '55313_NonProd_sket410_kubeconfig',
            extraHelmArgs: '--set internalEnvCode=sit',
            k8s_params: {
                namespacePrefix: 'sit'
            }
        },
        {
            name: 'ct1_uat_hk',
            displayName: 'CT1-UAT-HK',
            secureFileName: '55313_NonProd_sket410_kubeconfig',
            extraHelmArgs: '--set internalEnvCode=uat',
            k8s_params: {
                namespacePrefix: 'uat'
            },
            dependsOn: ['ct1_sit_hk']
        }
    ],
    cn1: [
        {
            name: 'cn1_uat_sct',
            displayName: 'CN1-UAT-SCT',
            secureFileName: '55313-NonProd-sken002-cnp-kubeconfig',
            extraHelmArgs: '--set enableNodeSelector=true'
        }
    ],
    id1: [
        {
            name: 'id1_uat_aks',
            displayName: 'ID1-UAT-AKS'
        }
    ],
}

const rbQaEnvMap = {
    df2: {
        name: 'df2_qa_sg',
        displayName: 'Rollback DF2-QA-SG'
    },
    gdcw2: {
        name: 'gdcw2_uat_ark',
        displayName: 'Rollback GDCW2-UAT-ARK',
        secureFileName: '55313-NonProd-skek408-ark-kubeconfig'
    },
    cn1: {
        name: 'cn1_uat_sct',
        displayName: 'Rollback CN1-UAT-SCT',
        secureFileName: '55313-NonProd-sken002-cnp-kubeconfig',
        extraHelmArgs: '--set enableNodeSelector=true'
    }
}

const preQaEnvMap = {
    df2: 'df2_uat_sg',
    cn1: 'cn1_uat_sct',
    df2_uat_uk: 'df2_uat_uk',
    id1: 'id1_uat_aks'
}

const qaEnvMap = {
    df2: {
        name: 'df2_qa_sg',
        displayName: 'DF2-QA-SG',
        dependsOn: ['df2_uat_sg']
    },
    gdcw2: {
        name: 'gdcw2_uat_ark',
        displayName: 'GDCW2-UAT-ARK',
        secureFileName: '55313-NonProd-skek408-ark-kubeconfig'
    },
    cn1: {
        name: 'cn1_uat_sct',
        displayName: 'CN1-UAT-SCT',
        secureFileName: '55313-NonProd-sken002-cnp-kubeconfig',
        extraHelmArgs: '--set enableNodeSelector=true'
    }
}

const prodEnvMap = {
    ct1: [
        {
            name: 'ct1_prod_hk',
            displayName: 'CT1-PRD-HK',
            secureFileName: '55313-Prod-sked009-hk-kubeconfig'
        }, {
            name: 'ct1_prod_sg',
            displayName: 'CT1-PRD-SG',
            secureFileName: '55313-Prod-sked009-sg-kubeconfig'
        }
    ],
    cn1: [
        {
            name: 'cn1_prod_uct',
            displayName: 'CN1-PRD-UCT',
            secureFileName: '55313-Prod-skec002-cnp-kubeconfig',
            extraHelmArgs: '--set enableNodeSelector=true'
        }, {
            name: 'cn1_prod_wgq',
            displayName: 'CN1-PRD-WGQ',
            secureFileName: '55313-Prod-skec002-cnd-kubeconfig',
            extraHelmArgs: '--set enableNodeSelector=true'
        }
    ],
    gdcw1: [
        {
            name: 'gdcw1_prod_ark',
            displayName: 'GDCW1-PRD-ARK',
            secureFileName: '55313-Prod-ark-kubeconfig'
        }, {
            name: 'gdcw1_prod_watford',
            displayName: 'GDCW1-PRD-WATFORD',
            secureFileName: '55313-Prod-watford-kubeconfig'
        }
    ],
    gdcw2: [
        {
            name: 'gdcw2_prod_ark',
            displayName: 'GDCW2-PRD-ARK',
            secureFileName: '55313-Prod-skeu408-ark-kubeconfig'
        }, {
            name: 'gdcw2_prod_watford',
            displayName: 'GDCW2-PRD-WATFORD',
            secureFileName: '55313-Prod-skeu408-wat-kubeconfig'
        }
    ],
    id1: [
        {
           name: 'id1_stg_aks',
           displayName: 'ID1-STG-AKS',
           cluster_rg: 'servicebench-indonesiacentral-rg'
        }, {
           name: 'id1_prod_aks',
           displayName: 'ID1-PRD-AKS',
           cluster_rg: 'servicebench-indonesiacentral-rg',
           dependsOn: 'id1_stg_aks'
        }
    ]
}

const dbEnvMap = {
    df2_sit_sg: {
        dbHost: 'v265wf00-srv-df-319-southe-dev001.df-3190.dev.azure.scbdev.net',
        dbPort: '6524',
        dbHcvPath: 'scb/v265wf00-srv-df-319-southe-dev001.df-3190.dev.azure.scbdev.net/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    df2_uat_sg: {
        dbHost: 'vqytyh00-srv-df-319-southe-dev001.df-3190.dev.azure.scbdev.net',
        dbPort: '6524',
        dbHcvPath: 'scb/vqytyh00-srv-df-319-southe-dev001.df-3190.dev.azure.scbdev.net/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    df2_qa_sg: {
        dbHost: 'vaowfc00-srv-df-319-southe-dev001.df-3190.dev.azure.scbdev.net',
        dbPort: '6524',
        dbHcvPath: 'scb/vaowfc00-srv-df-319-southe-dev001.df-3190.dev.azure.scbdev.net/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    df2_uat_uk: {
        dbHost: 'v5qoch00-srv-df-319-uksout-dev001.df-3190.dev.azure.scbdev.net',
        dbPort: '6524',
        dbHcvPath: 'tsa/v5qoch00-srv-df-319-uksout-dev001.df-3190.dev.azure.scbdev.net/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    ct1_dev_hk: {
        dbHost: 'hkifz4pl1wfkq00.hk.standardchartered.com',
        dbPort: '6524',
        dbHcvPath: 'scb/hkifz4pl1wfkq00.hk.standardchartered.com/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    ct1_sit_hk: {
        dbHost: 'hkifz4pl1wfkq00.hk.standardchartered.com',
        dbPort: '6524',
        dbHcvPath: 'scb/hkifz4pl1wfkq00.hk.standardchartered.com/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    ct1_uat_hk: {
        dbHost: 'hkifz4pl1wfkq00.hk.standardchartered.com',
        dbPort: '6524',
        dbHcvPath: 'scb/hkifz4pl1wfkq00.hk.standardchartered.com/static-creds/postgres_sb-55313-<%= componentId %>-app'
    },
    ct1_qa_hk: {
        dbHost: 'hkifz4pl1wfkq00.hk.standardchartered.com',
        dbPort: '6524',
        dbHcvPath: 'scb/hkifz4pl1wfkq00.hk.standardchartered.com/static-creds/postgres_sb-55313-<%= componentId %>-app'
    }
}

export {
    devEnvMap,
    rbQaEnvMap,
    preQaEnvMap,
    qaEnvMap,
    prodEnvMap,
    varEnvMap,
    idpEnvMap,
    dbEnvMap
}