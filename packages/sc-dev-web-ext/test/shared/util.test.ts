import { expect } from '@open-wc/testing';
import { debounce, formatOpt, uniqueOption } from '../../src/shared/util.js';

const sleep = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));

describe('test debounce and formatOpt and uniqueOption', () => {

  it('should call the function only once after the wait time', async () => {
    let callCount = 0;
    const originFunc = () => {
      callCount++;
    };
    const wait = 100;
    const debounceFunc = debounce(originFunc, wait);

    debounceFunc();
    debounceFunc();
    debounceFunc();

    await sleep(wait - 20);
    expect(callCount).to.equal(0);

    await sleep(20);
    expect(callCount).to.equal(1);
  });

  it('should pass arguments correctly to the original func', async () => {
    let receivedArgs = 0;
    const originFunc = (...args:any) => {
      receivedArgs = args;
    };
    const wait = 100;
    const debounceFunc = debounce(originFunc, wait);

    const arg1 = 'test1';
    const args = 'test2';

    debounceFunc(arg1, args);

    await sleep(wait);
    expect(receivedArgs).to.deep.equal([arg1, args]);
  });

  it('return full content formatOpt ', () => {
    const input1 = {
      businessTitle: 'Senior Manager',
      departmentEntity: {
        description: 'TSA PRJ SG DevOps',
      },
      address: {
        city: 'Singapore',
      },
      email: 'Aubrey.Masked.3C97@scbdev.com',
      phone: {
        phone: '***-***-*71',
      },
      businessFunction: {
        businessFunction: {
          description: 'IT-Projects-TSA Strgy & Arch',
        },
      },
      id: '1574871',
      name: 'Masked, Kendall',
    };
    const input2 = {
      businessTitle: 'Senior Manager',
      departmentEntity: {},
      address: {},
      email: 'Aubrey.Masked.3C97@scbdev.com',
      phone: {},
      businessFunction: {},
      id: '1574871',
      name: 'Masked, Kendall',
    };
    const output = formatOpt(input1);
    expect(output.value).to.deep.equal(`${input1.id}`);

    const output2 = formatOpt(input2);
    expect(output2.phone).to.deep.equal(undefined);
  });

  it('test uniqueOption', () => {
    const array1:any = [{
      id: '1',
      name: 'John1',
    },{
      id: '2',
      name: 'John2',
    }, {
      id: '1',
      name: 'John1',
    }];

    const result1 = uniqueOption(array1, 'id');
    expect(result1).to.deep.equal([{
      id: '1',
      name: 'John1',
    },{
      id: '2',
      name: 'John2',
    }]);

    const array2:any = [{
      id: '1',
      name: 'John1',
    },{
      id: '2',
      name: 'John2',
    }, {
      id: '3',
      name: 'John3',
    }];

    const result2 = uniqueOption(array2, 'id');
    expect(result2).to.deep.equal([{
      id: '1',
      name: 'John1',
    },{
      id: '2',
      name: 'John2',
    }, {
      id: '3',
      name: 'John3',
    }]);
  });


});
