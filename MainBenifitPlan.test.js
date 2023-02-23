import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as redux from 'react-redux';
import thunk from 'redux-thunk';
import 'babel-polyfill';
import MainBenifitPlan from '../components/MainBenifitPlan';
import { TurnedInNotRounded } from '@material-ui/icons';

const initialState = {};
const mockSelectValues = { network: { networkDetails: null } };
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

let store;
let wrapper;

describe('dispatch mock', () => {
  it('should mock dispatch', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    useDispatchSpy.mockClear();
  });
});
describe('selector mock', () => {
  it('should mock useSelector', () => {
    const useSelectorSpy = jest.spyOn(redux, 'useSelector');
    const mockSelectorFn = jest.fn();
    useSelectorSpy.mockReturnValue(mockSelectorFn);
    jest
      .spyOn(redux, 'useSelector')
      .mockImplementation(cb => cb({ ...mockSelectValues }));
    useSelectorSpy.mockClear();
  });
});

const mockUseImperativeHandle = jest.fn();
// Mock the module that contains useImperativeHandle
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useImperativeHandle: mockUseImperativeHandle,
}));

const mockUseEffect = () => {
  jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
};

const componentProps = {
  nonVvDropdown: {
    '30#R1': [
      {
        code: 'T2022',
        description: null,
        longDescription: null,
      },
    ],
  },
  values: { eligibilityMCTMaps: [{ mapSetID: 1234 }] },
  edit: true,
  dropdowns: {
    'R1#R_BP_NW_STAT_CD': [
      {
        code: 'INN',
        description: 'INN-In network',
        longDescription: 'In Network',
      },
    ],
    'Claims#R_BP_TY_CD': [
      {
        code: 'C',
        description: 'C-PCCM',
        longDescription: 'Primary Care Case Management',
      },
    ],
    'R1#R_BP_OPTNS_CD': [
      {
        code: '1',
        description: '1-PCP Reqd',
        longDescription: 'PCP Required',
      },
    ],
    'R1#R_BP_STAT_CD': [
      {
        code: 'A',
        description: 'A-Active',
        longDescription: 'Active',
      },
    ],
  },
  networkidDropdown: [
    {
      networkID: '122322',
      networkName: 'SAP',
      networkType: null,
      networkTypeDesc: null,
    },
  ],
  formValues: {
    lobId: 'MED',
    lobDesc: 'NHMEDICAID',
    benefitPlanID: '0001',
    endDate: '12/31/9999',
    beginDate: '01/01/2022',
    businessUnit: 'testing',
    benefitPlanDesc: 'testing description',
  },
  mainValues: {
    planType: 'F',
    optionsCode: '1',
    benefitPlanStatCode: 'A',
  },
  banifitPlan: true,
  errors: { planTypeErr: false, planStatusErr: false, planOptionErr: false },
  setDeleteCohortRow: jest.fn(),
  setspinnerLoader: jest.fn(),
  setDeleteRow: jest.fn(),
  setMainValues: jest.fn(),
  setNewCohortState: jest.fn(),
  setNewState: jest.fn(),
  setShowError: jest.fn(),
  setTabChangeValue: jest.fn(),
  setbanifitPlan: jest.fn(),
  setcapitationValues: jest.fn(),
  majorValidations: jest.fn().mockReturnValue(true),
  seterrorMessages: jest.fn(),
  setholdbackVo1Values: jest.fn(),
  handleMainChanges: jest.fn(),
};
describe('MainBenifitPlan Component Test Cases', () => {
  beforeEach(() => {
    mockUseEffect();
    jest
      .spyOn(redux, 'useSelector')
      .mockImplementation(cb => cb({ ...mockSelectValues }));
    store = mockStore(initialState);
  });

  it('render MainBenifitPlan component function', () => {
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...componentProps} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    expect(wrapper.exists()).toBeTruthy();
  });
  it('should call handelInputChange  function when name is netWorkStatus', () => {
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...componentProps} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const netWorkId = wrapper.find('[data-test="test_network_id_bp_tab"]');
    netWorkId.prop('onChange')({
      target: { value: '00', name: 'netWorkStatus' },
      nativeEvent: {
        target: { 0: { text: 'desc' } },
      },
    });
  });
  it('should call handelDateChange function', () => {
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...componentProps} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const netWorkId = wrapper.find('[data-test="test_network_id_bp_tab"]');
    netWorkId.prop('onChange')({
      target: {
        value: '00',
        name: 'random',
      },
    });
    const beginDate = wrapper.find('[data-test="test_beginDate"]');
    beginDate.prop('onChange')('setnewProviderDate', 'beginDate');
    const endDate = wrapper.find('[data-test="test_endDate"]');
    endDate.prop('onChange')('setnewProviderDate', 'endDate');
  });
  it('should call handleClick function', () => {
    const props = {
      ...componentProps,
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'DCYDJJ',
          netWorkStatus: '-1',
          rank: '',
          netWorkSateDesc: '',
          index: undefined,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });
  it('should call handleClick function when index greater than 1', () => {
    const props = {
      ...componentProps,
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'DCYDJJ',
          netWorkStatus: '-1',
          rank: '',
          netWorkSateDesc: '',
          index: 2,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });
  it('should call handelDateRankArrayOverlap  function', () => {
    const props = {
      ...componentProps,
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: '-1',
          netWorkStatus: '-1',
          rank: '9',
          netWorkSateDesc: '',
          index: -1,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });
  it('should call handelDateNetworkArrayOverlap ', () => {
    const props = {
      ...componentProps,
      newState: [],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/2020',
          netWorkId: '-1',
          netWorkStatus: '-1',
          rank: '0',
          netWorkSateDesc: '',
          index: -1,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });
  it('should call handleClick  function setshowerror case 1', () => {
    const props = {
      ...componentProps,
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '',
          endDate: '',
          netWorkId: '-1',
          netWorkStatus: '-1',
          rank: '9',
          netWorkSateDesc: '',
          index: -1,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });
  it('should call handleClick  function setshowerror case 2', () => {
    const props = {
      ...componentProps,
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        endDate: '',
        beginDate: '',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: 'Invalid Date',
          endDate: 'Invalid Date',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: [{}],
          netWorkSateDesc: '',
          index: -1,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });

  it('should call handleClick  function when no errors were there', () => {
    const props = {
      ...componentProps,
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });
  it('should call handleClick  function when no errors were there and inedx is -1', () => {
    const props = {
      ...componentProps,
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: -1,
          row: { associationSK: null, versionNo: null },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const addButton = wrapper.find('[data-testid="test_add_btn"]');
    addButton.simulate('click');
  });
  it('should call handelCandelFunction  function properly', () => {
    const props = {
      ...componentProps,
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const okButton = wrapper.find('[data-test="test_ok_btn"]');
    okButton.simulate('click');
  });
  it('should call handelDeleteClick  function properly', () => {
    const props = {
      ...componentProps,
      deleteRow: [],
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['Delete', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const okButton = wrapper.find('[data-test="test_ok_btn"]');
    okButton.simulate('click');
  });
  it('should call multiDelete  function properly', () => {
    const props = {
      ...componentProps,
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['multiDelete', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const okButton = wrapper.find('[data-test="test_ok_btn"]');
    okButton.simulate('click');
  });
  it('should push history to NetworkDetails pathname case1', () => {
    const props = {
      ...componentProps,
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
      cb({
        network: { networkDetails: { isRecordExist: true, errorCode: null } },
      })
    );
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['multiDelete', () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const viewButton = wrapper.find('[data-test="test_viewNetwork"]');
    viewButton.simulate('click');
    const deleteButton = wrapper.find('[data-test="test_delete_btn"]');
    deleteButton.simulate('click');
    const resetButton = wrapper.find('[data-test="test_reset_btn"]');
    resetButton.simulate('click');
    const cancelButton = wrapper.find('[data-test="test_cancel_btn"]');
    cancelButton.simulate('click');
  });
  it('should push history to NetworkDetails pathname case 2', () => {
    const props = {
      ...componentProps,
      edit: false,
      values: { eligibilityMCTMaps: false },
      errors: { planTypeErr: true, planStatusErr: true, planOptionErr: true },
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
      cb({
        network: {
          networkDetails: { isRecordExist: false, errorCode: undefined },
        },
      })
    );
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['Cancel', () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const dialog = wrapper.find('[data-test="test_dailog"]');
    dialog.prop('onClose')();
    const cancelBtn = wrapper.find('[data-test="test_deletePop_cancel_btn"]');
    cancelBtn.simulate('click');
    const trashBtn = wrapper.find('[data-test="test_trash_btn"]');
    trashBtn.simulate('click');
    const addBtn = wrapper.find('[data-test="test_addNetAss_btn"]');
    addBtn.simulate('click');
    const navigation = wrapper.find('[data-test="test_ntworkStatus_tab"]');
    navigation.prop('onChange')({ target: { value: 1 } });
  });
  it('should display error message case 1', () => {
    const props = {
      ...componentProps,
      edit: false,
      values: { eligibilityMCTMaps: false },
      errors: { planTypeErr: true, planStatusErr: true, planOptionErr: true },
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
      cb({
        network: {
          networkDetails: { isRecordExist: false, errorCode: undefined },
        },
      })
    );
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['Cancel', () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [
        {
          showBeginDateError: true,
          rankError: true,
          networkStatusError: true,
          showEndDateError: true,
          networkIDError: true,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const beginDate = wrapper.find('[data-test="test_beginDate"]');
    expect(beginDate.prop('error')).toBeTruthy();
    expect(beginDate.prop('helperText')).toEqual('Begin Date is required.');
    const endDate = wrapper.find('[data-test="test_endDate"]');
    expect(endDate.prop('error')).toBeTruthy();
    expect(endDate.prop('helperText')).toEqual('End Date is required.');
    const netStatusTab = wrapper.find('[data-test="test_ntworkStatus_tab"]');
    expect(netStatusTab.prop('errTxt')).toEqual('Network Status is required.');
    const netIDTab = wrapper.find('[data-test="test_network_id_bp_tab"]');
    expect(netIDTab.prop('errTxt')).toEqual('Network ID is required.');
    const rankField = wrapper.find('[data-testid="rank"]');
    rankField.prop('onChange')({ target: { value: 1 } });
    expect(rankField.prop('error')).toBeTruthy();
    expect(rankField.prop('helperText')).toEqual('Rank is required.');
  });
  it('should display error message case 2', () => {
    const props = {
      ...componentProps,
      edit: false,
      values: { eligibilityMCTMaps: false },
      errors: { planTypeErr: true, planStatusErr: true, planOptionErr: true },
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
      cb({
        network: {
          networkDetails: { isRecordExist: false, errorCode: undefined },
        },
      })
    );
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['Cancel', () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [
        {
          showHeaderBeginDateErr: true,
          showHeaderEndDateErr: true,
          RankErr: true,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const beginDate = wrapper.find('[data-test="test_beginDate"]');
    expect(beginDate.prop('error')).toBeTruthy();
    expect(beginDate.prop('helperText')).toEqual(
      'For each effective-dated row in a table, the begin date must be greater than or equal to the plan begin date and less than or equal to the plan end date.'
    );
    const endDate = wrapper.find('[data-test="test_endDate"]');
    expect(endDate.prop('error')).toBeTruthy();
    expect(endDate.prop('helperText')).toEqual(
      'For each effective-dated row in a table, the end date must be less than or equal to the plan end date and greater than or equal to the plan begin date.'
    );
    const rankField = wrapper.find('[data-testid="rank"]');
    expect(rankField.prop('error')).toBeTruthy();
    expect(rankField.prop('helperText')).toEqual(
      'There cannot be duplicate ranked rows on any benefit plan component tables.'
    );
  });
  it('should display error message case 3', () => {
    const props = {
      ...componentProps,
      edit: false,
      values: { eligibilityMCTMaps: false },
      errors: { planTypeErr: true, planStatusErr: true, planOptionErr: true },
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
      cb({
        network: {
          networkDetails: { isRecordExist: false, errorCode: undefined },
        },
      })
    );
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['Cancel', () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [
        {
          beginDtInvalidErr: true,
          endDtInvalidErr: true,
          showRankErrSpe: true,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const beginDate = wrapper.find('[data-test="test_beginDate"]');
    expect(beginDate.prop('error')).toBeTruthy();
    expect(beginDate.prop('helperText')).toEqual(
      'Begin Date that was entered is invalid.'
    );
    const endDate = wrapper.find('[data-test="test_endDate"]');
    expect(endDate.prop('error')).toBeTruthy();
    expect(endDate.prop('helperText')).toEqual(
      'End Date that was entered is invalid.'
    );
    const rankField = wrapper.find('[data-testid="rank"]');
    expect(rankField.prop('error')).toBeTruthy();
    expect(rankField.prop('helperText')).toEqual('Rank Should be Numeric.');
  });
  it('should display error message case 4', () => {
    const props = {
      ...componentProps,
      auditProps: {
        showAuditLog: true,
        auditType: 'AUDIT_LOG_BP_NW_ASCN',
        auditTypeCap: 'AUDIT_LOG_BP_COHRT',
        subAuditLogData: { AUDIT_LOG_BP_NW_ASCN: [{}] },
      },
      edit: false,
      values: { eligibilityMCTMaps: false },
      errors: { planTypeErr: true, planStatusErr: true, planOptionErr: true },
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
      cb({
        network: {
          networkDetails: { isRecordExist: false, errorCode: undefined },
        },
      })
    );
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['Cancel', () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: 'abcd',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: 1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [
        {
          showBgdtGTEnddtErr: true,
          showRankErrZero: true,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const beginDate = wrapper.find('[data-test="test_beginDate"]');
    expect(beginDate.prop('error')).toBeTruthy();
    expect(beginDate.prop('helperText')).toEqual(
      'For each effective-dated row in a table, the begin date must be less than or equal to the end date.'
    );
    const rankField = wrapper.find('[data-testid="rank"]');
    expect(rankField.prop('error')).toBeTruthy();
    expect(rankField.prop('helperText')).toEqual(
      'The rank field must be a numeric value greater than zero.'
    );
  });
  it('should display error message case 5', () => {
    const props = {
      ...componentProps,
      auditProps: {
        showAuditLog: false,
        auditType: 'AUDIT_LOG_BP_NW_ASCN',
        auditTypeCap: 'AUDIT_LOG_BP_COHRT',
        subAuditLogData: {},
      },
      edit: false,
      values: { eligibilityMCTMaps: false },
      errors: { planTypeErr: true, planStatusErr: true, planOptionErr: true },
      formValues: {
        lobId: 'MED',
        lobDesc: 'NHMEDICAID',
        benefitPlanID: '0001',
        beginDate: '01/01/2022',
        endDate: '12/31/9999',
        businessUnit: 'testing',
        benefitPlanDesc: 'testing description',
      },
      newState: [
        {
          associationSK: 50000836,
          beginDate: '01/01/2022',
          seqNum: '9',
          nwStatCode: 'INN',
          nwEndDate: '12/31/9999',
          nwID: 'DCYDJJ',
          nwStatCodeDesc: 'INN-In network',
        },
      ],
      mainValues: { planType: 'H' },
    };
    jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
      cb({
        network: {
          networkDetails: { isRecordExist: false, errorCode: undefined },
        },
      })
    );
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['Cancel', () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [[{ dat: '01' }], () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [true, () => null])
      .mockImplementationOnce(() => [
        {
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          netWorkId: '',
          netWorkStatus: '1',
          rank: '9',
          netWorkSateDesc: 'desc',
          index: -1,
          row: { associationSK: 1234, versionNo: 1 },
        },
        () => null,
      ])
      .mockImplementationOnce(() => [{}, () => null])
      .mockImplementationOnce(() => [
        {
          showRankOverlapErr: true,
        },
        () => null,
      ])
      .mockImplementationOnce(() => [[], () => null])

      .mockImplementation(x => [x, () => null]);
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const rankField = wrapper.find('[data-testid="rank"]');
    expect(rankField.prop('error')).toBeTruthy();
    expect(rankField.prop('helperText')).toEqual(
      'There cannot be duplicate ranked rows on any benefit plan component tables.'
    );
  });
  /*
    it('should display error message case 5', () => {
      const props = {
        ...componentProps,
        auditProps: {
          showAuditLog: false,
          auditType: 'AUDIT_LOG_BP_NW_ASCN',
          auditTypeCap: 'AUDIT_LOG_BP_COHRT',
          subAuditLogData: {},
        },
        edit: false,
        values: { eligibilityMCTMaps: false },
        errors: { planTypeErr: true, planStatusErr: true, planOptionErr: true },
        formValues: {
          lobId: 'MED',
          lobDesc: 'NHMEDICAID',
          benefitPlanID: '0001',
          beginDate: '01/01/2022',
          endDate: '12/31/9999',
          businessUnit: 'testing',
          benefitPlanDesc: 'testing description',
        },
        newState: [
          {
            associationSK: 50000836,
            beginDate: '01/01/2022',
            seqNum: '9',
            nwStatCode: 'INN',
            nwEndDate: '12/31/9999',
            nwID: 'DCYDJJ',
            nwStatCodeDesc: 'INN-In network',
          },
        ],
        mainValues: { planType: 'H' },
      };
      jest.spyOn(redux, 'useSelector').mockImplementation(cb =>
        cb({
          network: {
            networkDetails: { isRecordExist: false, errorCode: undefined },
          },
          appDropDowns: { printLayout: [] },
        })
      );
      render(
        <Provider store={store}>
          <Router>
            <MainBenifitPlan {...props} />
          </Router>
        </Provider>
      );
    });
  it('should set ref.current.validateFn to a function', () => {
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...componentProps} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    console.log('wrapper:', wrapper.debug());
    const instance = wrapper.instance();
    console.log('instance', instance.debug());
    const ref = { current: null };
    instance.useImperativeHandle(ref, () => ({
      validateFn: () => {},
    }));
    expect(ref.current.validateFn).toBeInstanceOf(Function);
  });

  it('should call handelMainTabSaveValidations and capitationTabRef.current.validateCap when appropriate props are present', () => {
    const instance = wrapper.instance();
    const props = {
      ...componentProps,
      tabChangeValue: {
        mainTab: true,
        capitationTab: true,
      },
      newState: [],
    };
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan {...props} />
        </Router>
      </Provider>
    )
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();
    const capitationTabRef = { current: { validateCap: jest.fn() } };
    instance.props = props;
    instance.capitationTabRef = capitationTabRef;
    jest.spyOn(instance, 'handelMainTabSaveValidations');
    instance.validateFn();
    expect(instance.handelMainTabSaveValidations).toHaveBeenCalled();
    expect(capitationTabRef.current.validateCap).toHaveBeenCalled();
  });
  */
  it('should call validateFn when the mainTab is selected', () => {
    // Create a ref object for the component
    const ref = { current: null }; // Render the component and assign the ref to it
    render(
      <Provider store={store}>
        <Router>
          <MainBenifitPlan ref={ref} />
        </Router>
      </Provider>
    );
    // Invoke the mock function that useImperativeHandle should have received
    const [, callback] = mockUseImperativeHandle.mock.calls[0];
    // Invoke the callback to get the object that useImperativeHandle should return
    const { validateFn } = callback();
    // Create a spy for handelMainTabSaveValidations
    const spy = jest.spyOn(ref.current, 'handelMainTabSaveValidations');
    // Call validateFn with the appropriate props
    validateFn({
      tabChangeValue: { mainTab: true },
      capitationTabRef: { current: { validateCap: jest.fn() } },
      newState: [],
      setSuccess: jest.fn(),
      setProviderNetOneErr: jest.fn(),
      setDeleteSuccess: jest.fn(),
      seterrorMessages: jest.fn(),
      setSuccessMessages: jest.fn(),
      setShowError: jest.fn(),
      formValues: { beginDate: new Date(), endDate: new Date() },
    }); // Expect handelMainTabSaveValidations to have been called
    expect(spy).toHaveBeenCalled();
  });
});
