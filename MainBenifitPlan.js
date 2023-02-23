import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import 'moment-range';
import DateFnsUtils from '@date-io/date-fns';
import dateFnsFormat from 'date-fns/format';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from 'react-bootstrap';
import * as ErrorConst from '../../../SharedModules/Messages/ErrorMsgConstants';
/*tabel component import */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import BenfitTabelComponent from './BenfitTabelComponent';
import BenefitPlanCapitation from './BenefitPlanCapitation';
import { Link } from 'react-router-dom';
import AuditLogRow from '../../../SharedModules/AuditLog/AuditLogRow';
import * as AuditConstant from '../../../SharedModules/AuditLog/AuditLogConstants';
import { getLoginUserDetails } from '../../../SharedModules/utility/utilityFunction';
import { getNetworkDetails } from '../../Network/action';
import { useDispatch, useSelector } from 'react-redux';
import NativeDropDown from '../../../SharedModules/Dropdowns/NativeDropDown';
import { each } from 'jquery';
import { isReadOnly } from '../../../SharedModules/utility/utilityFunction';

function MainbenifitPlan(props, ref) {
  const userDetails = getLoginUserDetails();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [selectDeleteArray, setSelectDeleteArray] = React.useState([]);
  const capitationTabRef = useRef();
  const [redirectCheck, setRedirectCheck] = React.useState(false);
  const { banifitPlan, setbanifitPlan } = props;
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);
  const [providerNetOneErr, setProviderNetOneErr] = React.useState(false);
  const [newProviderDate, setnewProviderDate] = React.useState({
    beginDate: '',
    endDate: '12/31/9999',
    netWorkId: '-1',
    netWorkStatus: '-1',
    rank: '',
    netWorkSateDesc: '',
  });

  const [resetProviderDate, setresetProviderDate] = React.useState({
    beginDate: '',
    endDate: '12/31/9999',
    netWorkId: '-1',
    netWorkStatus: '-1',
    rank: '',
    netWorkSateDesc: '',
  });

  //webninja
  const [
    {
      showHeaderDateErr,
      showBeginDateError,
      showEndDateError,
      beginDtInvalidErr,
      endDtInvalidErr,
      showRankOverlapErr,
      showNetworkOverlapErr,
      networkIDError,
      networkStatusError,
      rankError,
      showRankErrSpe,
      showRankErrZero,
      showBgdtGTEnddtErr,
      RankErr,
      showHeaderBeginDateErr,
      showHeaderEndDateErr,
    },
    setShowError,
  ] = React.useState(false);

  const [successMessages, setSuccessMessages] = React.useState([]);

  const networkDetails = useSelector(state => state.network.networkDetails);
  const networkDetailsTime = useSelector(
    state => state.network.networkDetailsTime
  );
  const dispatch = useDispatch();
  const onSearchView = searchvalues =>
    dispatch(getNetworkDetails(searchvalues));
  let reqFieldArr = [];

  //webninja
  const formatDate = dt => {
    if (!dt) {
      return '';
    }
    dt = new Date(dt);
    if (dt.toString() == 'Invalid Date') {
      return dt;
    } else {
      return dateFnsFormat(dt, 'MM/dd/yyyy');
    }
  };

  const handelInputChange = event => {
    props.setTabChangeValue({ ...props.tabChangeValue, mainTab: true });
    if (event.target.name === 'netWorkStatus') {
      setnewProviderDate({
        ...newProviderDate,
        [event.target.name]: event.target.value,
        netWorkSateDesc:
          event.nativeEvent.target[event.nativeEvent.target.selectedIndex]
            ?.text,
      });
    } else {
      setnewProviderDate({
        ...newProviderDate,
        [event.target.name]: event.target.value,
      });
    }
  };
  const handelDateChange = (type, name) => date => {
    props.setTabChangeValue({ ...props.tabChangeValue, mainTab: true });
    if (type === 'setnewProviderDate') {
      setnewProviderDate({ ...newProviderDate, [name]: formatDate(date) });
    }
  };

  const handelDateRngeOverlap = (
    initalStartDate,
    initialEndDate,
    secondaryStartDate,
    secondaryEndDate
  ) => {
    const range1 = moment().range(
      new Date(initalStartDate),
      new Date(initialEndDate)
    );
    const range2 = moment().range(
      new Date(secondaryStartDate),
      new Date(secondaryEndDate)
    );
    return range1.overlaps(range2);
  };

  const handelDateNetworkArrayOverlap = (
    initalStartDate,
    initialEndDate,
    networkId,
    inputArray
  ) => {
    if (inputArray.length > 0) {
      const result = inputArray.map(each => {
        if (
          handelDateRngeOverlap(
            initalStartDate,
            initialEndDate,
            each.beginDate,
            each.nwEndDate
          )
        ) {
          if (each.nwID == networkId && each.beginDate == initalStartDate) {
            return true;
          }
          return false;
        }
      });
      if (result.filter(e => e === true).length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handelDateRankArrayOverlap = (
    initalStartDate,
    initialEndDate,
    Rank,
    inputArray
  ) => {
    if (inputArray.length > 0) {
      const result = inputArray.map(each => {
        if (
          handelDateRngeOverlap(
            initalStartDate,
            initialEndDate,
            each.beginDate,
            each.nwEndDate
          )
        ) {
          if (each.seqNum == Rank) {
            return true;
          }
          return false;
        }
      });
      if (result.filter(e => e === true).length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handelClick = async () => {
    const tableData = props.newState;
    //webninja
    setSuccess(false);
    //setDeleteSuccess({networkDelete:false,providerDelete:false});
    setDeleteSuccess(false);
    setShowError(false);
    props.setShowError(false);
    setProviderNetOneErr(false);
    props.seterrorMessages([]);
    setSuccessMessages([]);
    reqFieldArr = [];
    let overlapArray;
    if (
      tableData.length > 0 &&
      newProviderDate.index === undefined &&
      props.mainValues &&
      props.mainValues.planType === 'H'
    ) {
      props.seterrorMessages(ErrorConst.Provider_network_Error);
      setProviderNetOneErr(true);
      return false;
    }
    if (newProviderDate.index > -1) {
      overlapArray = tableData.filter(
        e =>
          e.beginDate != formatDate(resetProviderDate.beginDate) ||
          e.nwEndDate != formatDate(resetProviderDate.endDate)
      );
    } else {
      overlapArray = tableData;
    }
    const networkOverlap = await handelDateNetworkArrayOverlap(
      formatDate(newProviderDate.beginDate),
      formatDate(newProviderDate.endDate),
      newProviderDate.netWorkId,
      overlapArray
    );
    const rankOverlap = await handelDateRankArrayOverlap(
      formatDate(newProviderDate.beginDate),
      formatDate(newProviderDate.endDate),
      newProviderDate.rank,
      overlapArray
    );
    setShowError({
      showBeginDateError: newProviderDate.beginDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Begin_Date_Error);
            return true;
          })(),
      showEndDateError: newProviderDate.endDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.End_Date_Error);
            return true;
          })(),
      beginDtInvalidErr:
        formatDate(newProviderDate.beginDate).toString() == 'Invalid Date' &&
        newProviderDate.beginDate != ''
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_Begin_Date_Error);
              return true;
            })()
          : false,
      endDtInvalidErr:
        formatDate(newProviderDate.endDate).toString() == 'Invalid Date'
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_End_Date_Error);
              return true;
            })()
          : false,
      networkIDError:
        newProviderDate.netWorkId && newProviderDate.netWorkId != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Network_ID_Error);
              return true;
            })(),
      networkStatusError:
        newProviderDate.netWorkStatus && newProviderDate.netWorkStatus != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Network_Status_Error);
              return true;
            })(),
      showRankErrSpe: !isNaN(parseInt(newProviderDate.rank))
        ? false
        : (() => {
            if (newProviderDate.rank.length !== 0) {
              reqFieldArr.push(ErrorConst.BENEFIT_PLAN_RANKING_ZERO_ERROR);
              return true;
            } else return false;
          })(),
      showRankErrZero:
        newProviderDate.rank < 1 && newProviderDate.rank.length
          ? (() => {
              reqFieldArr.push(ErrorConst.BENEFIT_PLAN_RANKING_ZERO);
              return true;
            })()
          : false,
      rankError:
        newProviderDate.rank.length < 1
          ? (() => {
              reqFieldArr.push(ErrorConst.Rank_Error);
              return true;
            })()
          : false,

      showHeaderBeginDateErr:
        newProviderDate.beginDate &&
        !(
          new Date(newProviderDate.beginDate) >=
            new Date(formatDate(props.formValues.beginDate)) &&
          new Date(newProviderDate.beginDate) <=
            new Date(formatDate(props.formValues.endDate))
        )
          ? (() => {
              reqFieldArr.push(
                ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk
              );
              return true;
            })()
          : false,

      showHeaderEndDateErr:
        newProviderDate.endDate &&
        !(
          new Date(newProviderDate.endDate) <=
          new Date(formatDate(props.formValues.endDate))
        )
          ? (() => {
              reqFieldArr.push(ErrorConst.Fall_In_Header_End_Date_Err);
              return true;
            })()
          : false,
      // End header date error
      showBgdtGTEnddtErr:
        newProviderDate.beginDate &&
        newProviderDate.endDate &&
        new Date(newProviderDate.beginDate) >= new Date(newProviderDate.endDate)
          ? (() => {
              //reqFieldArr.push(ErrorConst.Bgndt_GT_Enddt_Err);
              reqFieldArr.push(ErrorConst.Date_Range_Error);
              return true;
            })()
          : false,
      showNetworkOverlapErr:
        newProviderDate.beginDate &&
        newProviderDate.endDate &&
        newProviderDate.netWorkId &&
        networkOverlap
          ? (() => {
              reqFieldArr.push(ErrorConst.NETWORK_TABLE_OVERLAP);
              return true;
            })()
          : false,
      showRankOverlapErr:
        newProviderDate.beginDate &&
        newProviderDate.endDate &&
        newProviderDate.rank &&
        rankOverlap
          ? (() => {
              reqFieldArr.push(ErrorConst.RANK_TABLE_OVERLAP);
              return true;
            })()
          : false,
    });
    props.setShowError({
      planBeginDateError: props.formValues.beginDate ? false : true,
      planEndDateError: props.formValues.endDate ? false : true,
    });

    if (reqFieldArr.length > 0) {
      props.seterrorMessages(reqFieldArr);
      return false;
    }

    const data = {
      auditUserID: userDetails.loginUserID,
      auditTimeStamp: new Date(),
      addedAuditUserID: userDetails.loginUserID,
      addedAuditTimeStamp: new Date(),
      versionNo:
        newProviderDate.row && newProviderDate.row.versionNo
          ? newProviderDate.row.versionNo
          : 0,
      dbRecord: false,
      sortColumn: null,
      auditKeyList: [],
      auditKeyListFiltered: false,
      beginDate: formatDate(newProviderDate.beginDate),
      seqNum: newProviderDate.rank,
      nwStatCode: newProviderDate.netWorkStatus,
      nwEndDate: formatDate(newProviderDate.endDate),
      nwID: newProviderDate.netWorkId,
      nwStatCodeDesc: newProviderDate.netWorkSateDesc,
      associationSK:
        newProviderDate.row && newProviderDate.row.associationSK
          ? newProviderDate.row.associationSK
          : null,
    };

    newProviderDate.index > -1
      ? (tableData[newProviderDate.index] = data)
      : tableData.push(data);

    props.setNewState(tableData);
    setSuccess(true);
    setnewProviderDate({
      beginDate: '',
      endDate: '12/31/9999',
      netWorkId: '',
      netWorkStatus: '',
      rank: '',
      netWorkSateDesc: '',
    });
    setresetProviderDate({
      beginDate: '',
      endDate: '12/31/9999',
      netWorkId: '',
      netWorkStatus: '',
      rank: '',
      netWorkSateDesc: '',
    });
    setbanifitPlan(false);
    props.setTabChangeValue({ ...props.tabChangeValue, mainTab: false });
  };

  const handelDeleteClick = () => {
    setSuccess(false);
    setProviderNetOneErr(false);
    const tableData = props.newState;
    if (newProviderDate.row && newProviderDate.row.associationSK) {
      let deleteData = props.deleteRow;
      deleteData.push({
        auditUserID: newProviderDate.row.auditUserID,
        auditTimeStamp: newProviderDate.row.auditTimeStamp,
        addedAuditUserID: newProviderDate.row.addedAuditUserID,
        addedAuditTimeStamp: newProviderDate.row.addedAuditTimeStamp,
        versionNo:
          newProviderDate.row && newProviderDate.row.versionNo
            ? newProviderDate.row.versionNo
            : 0,
        dbRecord: false,
        sortColumn: null,
        auditKeyList: [],
        auditKeyListFiltered: false,
        beginDate: formatDate(newProviderDate.beginDate),
        seqNum: newProviderDate.rank,
        nwStatCode: newProviderDate.netWorkStatus,
        nwEndDate: formatDate(newProviderDate.endDate),
        nwID: newProviderDate.netWorkId,
        nwStatCodeDesc: newProviderDate.netWorkSateDesc,
        associationSK:
          newProviderDate.row && newProviderDate.row.associationSK
            ? newProviderDate.row.associationSK
            : null,
      });
      props.setDeleteRow(deleteData);
    }
    tableData.splice(newProviderDate.index, 1);
    props.setNewState(tableData);
    setShowError(false);
    setnewProviderDate({
      beginDate: '',
      endDate: '12/31/9999',
      netWorkId: '-1',
      netWorkStatus: '-1',
      rank: '',
      netWorkSateDesc: '',
    });
    setresetProviderDate({
      beginDate: '',
      endDate: '12/31/9999',
      netWorkId: '-1',
      netWorkStatus: '-1',
      rank: '',
      netWorkSateDesc: '',
    });
    //setDeleteSuccess({networkDelete:false,providerDelete:true});

    setbanifitPlan(false);
    setDialogOpen(false);
    setDialogType('');
    setDeleteSuccess(true);
  };

  const handelResetClick = () => {
    props.seterrorMessages([]);
    setProviderNetOneErr(false);
    setnewProviderDate(resetProviderDate);
    setShowError(false);
    props.setTabChangeValue({ ...props.tabChangeValue, mainTab: false });
  };
  const handelCandelFunction = () => {
    setbanifitPlan(false);
    setShowError(false);
    setDialogOpen(false);
    setDialogType('');
  };

  const scrollToRef = ref =>
    ref.current?.scrollIntoView({ behavior: 'smooth' });

  const addnetassotiationrefs = useRef(null);
  const MBPscrolltoView = () => {
    setTimeout(
      function () {
        scrollToRef(addnetassotiationrefs);
      }.bind(this),
      500
    );
  };

  const multiDelete = () => {
    setDialogOpen(false);
    setDialogType('');
    props.seterrorMessages([]);
    setSuccess(false);
    setProviderNetOneErr(false);
    setSuccessMessages([]);
    if (selectDeleteArray.length > 0) {
      let CI = props.newState;
      selectDeleteArray.map((value, index) => {
        let curIndex = CI.findIndex(i =>
          moment(i.beginDate).isSame(value.beginDate)
        );
        CI.splice(curIndex, 1);
      });
      props.setNewState(CI);
      props.setDeleteRow(selectDeleteArray);
      setSelectDeleteArray([]);
      setDeleteSuccess(true);
    }
  };

  useImperativeHandle(ref, () => {
    return { validateFn };
  });

  const validateFn = () => {
    if (props.tabChangeValue.mainTab) {
      handelMainTabSaveValidations();
    }
    if (props.tabChangeValue.capitationTab) {
      capitationTabRef.current.validateCap();
    }
  };

  const handelMainTabSaveValidations = async () => {
    const tableData = props.newState;
    //webninja
    setSuccess(false);
    setProviderNetOneErr(false);
    //setDeleteSuccess({networkDelete:false,providerDelete:false});
    setDeleteSuccess(false);
    props.seterrorMessages([]);
    setSuccessMessages([]);
    let reqFieldArr = [];
    let overlapArray;
    if (newProviderDate.index > -1) {
      overlapArray = tableData.filter(
        e =>
          e.beginDate != formatDate(resetProviderDate.beginDate) ||
          e.nwEndDate != formatDate(resetProviderDate.endDate)
      );
    } else {
      overlapArray = tableData;
    }
    const networkOverlap = await handelDateNetworkArrayOverlap(
      formatDate(newProviderDate.beginDate),
      formatDate(newProviderDate.endDate),
      newProviderDate.netWorkId,
      overlapArray
    );
    const rankOverlap = await handelDateRankArrayOverlap(
      formatDate(newProviderDate.beginDate),
      formatDate(newProviderDate.endDate),
      newProviderDate.rank,
      overlapArray
    );
    setShowError({
      showBeginDateError: newProviderDate.beginDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Begin_Date_Error);
            return true;
          })(),
      showEndDateError: newProviderDate.endDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.End_Date_Error);
            return true;
          })(),
      beginDtInvalidErr:
        formatDate(newProviderDate.beginDate).toString() == 'Invalid Date'
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_Begin_Date_Error);
              return true;
            })()
          : false,
      endDtInvalidErr:
        formatDate(newProviderDate.endDate).toString() == 'Invalid Date'
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_End_Date_Error);
              return true;
            })()
          : false,
      networkIDError:
        newProviderDate.netWorkId && newProviderDate.netWorkId != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Network_ID_Error);
              return true;
            })(),
      networkStatusError:
        newProviderDate.netWorkStatus && newProviderDate.netWorkStatus != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Network_Status_Error);
              return true;
            })(),
      showRankErrSpe: !isNaN(parseInt(newProviderDate.rank))
        ? false
        : (() => {
            if (newProviderDate.rank.length !== 0) {
              reqFieldArr.push(ErrorConst.BENEFIT_PLAN_RANKING_ZERO_ERROR);
              return true;
            } else return false;
          })(),
      showRankErrZero:
        newProviderDate.rank < 1 && newProviderDate.rank.length
          ? (() => {
              reqFieldArr.push(ErrorConst.BENEFIT_PLAN_RANKING_ZERO);
              return true;
            })()
          : false,
      rankError:
        newProviderDate.rank.length < 1
          ? (() => {
              reqFieldArr.push(ErrorConst.Rank_Error);
              return true;
            })()
          : false,

      showHeaderBeginDateErr: !(
        new Date(newProviderDate.beginDate) >=
          new Date(formatDate(props.formValues.beginDate)) &&
        new Date(newProviderDate.beginDate) <=
          new Date(formatDate(props.formValues.endDate))
      )
        ? (() => {
            reqFieldArr.push(
              ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk
            );
            return true;
          })()
        : false,

      showHeaderEndDateErr:
        newProviderDate.endDate &&
        !(
          new Date(newProviderDate.endDate) <=
          new Date(formatDate(props.formValues.endDate))
        )
          ? (() => {
              reqFieldArr.push(ErrorConst.Fall_In_Header_End_Date_Err);
              return true;
            })()
          : false,
      // End header date error
      showBgdtGTEnddtErr:
        new Date(newProviderDate.beginDate) >= new Date(newProviderDate.endDate)
          ? (() => {
              //reqFieldArr.push(ErrorConst.Bgndt_GT_Enddt_Err);
              reqFieldArr.push(ErrorConst.Date_Range_Error);
              return true;
            })()
          : false,
      showNetworkOverlapErr:
        newProviderDate.beginDate &&
        newProviderDate.endDate &&
        newProviderDate.netWorkId &&
        networkOverlap
          ? (() => {
              reqFieldArr.push(ErrorConst.NETWORK_TABLE_OVERLAP);
              return true;
            })()
          : false,
      showRankOverlapErr:
        newProviderDate.beginDate &&
        newProviderDate.endDate &&
        newProviderDate.rank &&
        rankOverlap
          ? (() => {
              reqFieldArr.push(ErrorConst.RANK_TABLE_OVERLAP);
              return true;
            })()
          : false,
    });
    props.setShowError({
      planBeginDateError: props.formValues.beginDate ? false : true,
      planEndDateError: props.formValues.endDate ? false : true,
    });

    if (reqFieldArr.length) {
      props.seterrorMessages(reqFieldArr);
      return false;
    }
  };

  React.useEffect(() => {
    if (networkDetails != null && redirectCheck) {
      let errorMessagesArray = [];
      if (
        (networkDetails.errorCode === null ||
          networkDetails.errorCode === undefined) &&
        networkDetails.isRecordExist
      ) {
        setRedirectCheck(true);
        props.setspinnerLoader(false);
        props.history.push({
          pathname: '/NetworkDetails',
        });
      } else {
        setRedirectCheck(false);
        props.setspinnerLoader(false);
        errorMessagesArray.push(ErrorConst.ERROR_OCCURED_DURING_TRANSACTION);
        props.seterrorMessages(errorMessagesArray);
      }
    }
  }, [networkDetailsTime]);

  const navigateToNetworkDetails = row => {
    onSearchView({ networkId: row.netWorkId });
    props.setspinnerLoader(true);
    setRedirectCheck(true);
  };
  const networkStatusDrpDwn =
    props.dropdowns &&
    props.dropdowns &&
    props.dropdowns['R1#R_BP_NW_STAT_CD'] &&
    props.dropdowns['R1#R_BP_NW_STAT_CD'].map(each => (
      <option selected key={each.code} value={each.code}>
        {each.description}
      </option>
    ));
  const networkIDDrpDwn =
    props.networkidDropdown &&
    props.networkidDropdown.length > 0 &&
    props.networkidDropdown.map(each => (
      <option selected key={each.networkID} value={each.networkID}>
        {each.networkID} - {each.networkName}
      </option>
    ));

  let sortedDataBP = [];
  if (props.dropdowns != undefined) {
    if (props.dropdowns['Claims#R_BP_TY_CD'] != null) {
      let temp = props.dropdowns['Claims#R_BP_TY_CD'];
      sortedDataBP = temp.sort((a, b) =>
        a.code.toLowerCase() < b.code.toLowerCase()
          ? -1
          : b.code.toLowerCase() > a.code.toLowerCase()
          ? 1
          : 0
      );
    }
  }

  const benefitPlanTypeDrpDwn = sortedDataBP.map(each => (
    <option selected key={each.code} value={each.code}>
      {each.description}
    </option>
  ));
  let sortedDataBPO = [];
  if (props.dropdowns != undefined) {
    if (props.dropdowns['R1#R_BP_OPTNS_CD'] != null) {
      let temp = props.dropdowns['R1#R_BP_OPTNS_CD'];
      sortedDataBPO = temp.sort((a, b) =>
        a.code.toLowerCase() < b.code.toLowerCase()
          ? -1
          : b.code.toLowerCase() > a.code.toLowerCase()
          ? 1
          : 0
      );
    }
  }
  const benifitPlanOptionDrpDwn = sortedDataBPO.map(each => (
    <option selected key={each.code} value={each.code}>
      {each.description}
    </option>
  ));
  const benefitPlanStatusDrpDwn =
    props.dropdowns &&
    props.dropdowns &&
    props.dropdowns['R1#R_BP_STAT_CD'] &&
    props.dropdowns['R1#R_BP_STAT_CD'].map(each => (
      <option selected key={each.code} value={each.code}>
        {each.description}
      </option>
    ));

  const isReadOnlyAccess = isReadOnly();

  return (
    <>
      <div className="pos-relative">{/*webninja*/}</div>
      <Dialog
        data-test="test_dailog"
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setDialogType('');
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="custom-alert-box"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogType == 'Delete' || dialogType == 'multiDelete'
              ? 'Are you sure that you want to Delete.'
              : dialogType == 'Cancel'
              ? 'Are you sure that you want to Cancel ?'
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            title="Ok"
            data-test="test_ok_btn"
            onClick={() => {
              dialogType == 'Delete'
                ? handelDeleteClick()
                : dialogType == 'multiDelete'
                ? multiDelete()
                : handelCandelFunction();
            }}
            color="primary"
            className="btn btn-success"
          >
            Ok
          </Button>
          <Button
            title="Cancel"
            data-test="test_deletePop_cancel_btn"
            onClick={() => {
              setDialogOpen(false);
              setDialogType('');
            }}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {props.edit ? (
        <div className="tabs-container">
          <div className="tab-header">
            <h3 className="tab-heading float-left">
              Benefit Plan - Eligibility (MCT) Maps
            </h3>
            <div className="clearfix" />
          </div>
          <div className="flex-container-n">
            {props.values.eligibilityMCTMaps
              ? props.values.eligibilityMCTMaps.map(each => (
                  <div className="flex-item-n">
                    <span>{each.mapSetID} : </span>
                    <Link
                      to={`MapSetSearch?id=${each.mapSetID}`}
                      target="_blank"
                      className="cndt-link"
                    >
                      {each.mapSetDesc}
                    </Link>
                  </div>
                ))
              : null}
          </div>
        </div>
      ) : null}
      <div className="tabs-container tabs-container-inner mt-0">
        <div className="tab-header">
          <h3 className="tab-heading float-left">Benefit Plan - Main</h3>
          <div className="clearfix" />
        </div>
        <div className="tab-body-bordered mt-2">
          <div className="form-wrapper">
            <NativeDropDown
              id="benefit_plan_type_bp_tab"
              label="Benefit Plan Type"
              inputProps={{ maxLength: 2, 'data-testid': 'test-dropdown' }}
              value={props.mainValues.planType}
              name="planType"
              onChange={props.handleMainChanges('planType')}
              dropdownList={benefitPlanTypeDrpDwn}
              isRequired={true}
              errTxt={
                props.errors.planTypeErr
                  ? ErrorConst.Benefit_Plan_Type_Error
                  : null
              }
              disabled={isReadOnlyAccess}
            />
            <NativeDropDown
              id="benefit_plan_option_bp_tab"
              label="Benefit Plan Option"
              data-test="benefit_plan"
              inputProps={{ maxLength: 2, 'data-test': 'test-dropdown' }}
              value={props.mainValues.optionsCode}
              name="optionsCode"
              onChange={props.handleMainChanges('optionsCode')}
              dropdownList={benifitPlanOptionDrpDwn}
              isRequired={true}
              errTxt={
                props.errors.planOptionErr
                  ? ErrorConst.Benefit_Plan_Option_Error
                  : null
              }
              disabled={isReadOnlyAccess}
            />

            <NativeDropDown
              id="benefit_plan_status_bp_tab"
              label="Benefit Plan Status"
              inputProps={{ maxLength: 2, 'data-testid': 'test-dropdown' }}
              value={props.mainValues.benefitPlanStatCode}
              name="benefitPlanStatCode"
              onChange={props.handleMainChanges('benefitPlanStatCode')}
              dropdownList={benefitPlanStatusDrpDwn}
              isRequired={true}
              errTxt={
                props.errors.planStatusErr
                  ? ErrorConst.Benefit_Plan_Status_Error
                  : null
              }
              disabled={isReadOnlyAccess}
            />
          </div>
        </div>
      </div>
      {props.nonVvDropdown &&
      Object.keys(props.nonVvDropdown).length > 0 &&
      (props.mainValues.optionsCode == '1' ||
        props.mainValues.planType == 'Q' ||
        props.mainValues.planType == 'T' ||
        props.mainValues.planType == 'M') ? (
        <BenefitPlanCapitation
          privileges={props.privileges}
          setNewState={props.setNewState}
          seterrorMessages={props.seterrorMessages}
          handleChanges={props.handleChanges}
          newState={props.newState}
          dropdowns={props.dropdowns}
          networkidDropdown={props.networkidDropdown}
          formValues={props.formValues}
          setShowError={props.setShowError}
          mainValues={props.mainValues}
          setMainValues={props.setMainValues}
          handleMainChanges={props.handleMainChanges}
          values={props.values}
          deleteRow={props.deleteRow}
          setDeleteRow={props.setDeleteRow}
          mapIdDropdown={props.mapIdDropdown}
          capitationValues={props.capitationValues}
          setcapitationValues={props.setcapitationValues}
          handleCapitationChanges={props.handleCapitationChanges}
          nonVvDropdown={props.nonVvDropdown}
          setholdbackVo1Values={props.setholdbackVo1Values}
          holdbackVo1Values={props.holdbackVo1Values}
          setholdbackVo2Values={props.setholdbackVo2Values}
          holdbackVo2Values={props.holdbackVo2Values}
          setNewCohortState={props.setNewCohortState}
          newCohortState={props.newCohortState}
          deleteCohortRow={props.deleteCohortRow}
          setDeleteCohortRow={props.setDeleteCohortRow}
          handleholdbackVo1Changes={props.handleholdbackVo1Changes}
          handleholdbackVo2Changes={props.handleholdbackVo2Changes}
          currprocErr={props.currprocErr}
          retroprocErr={props.retroprocErr}
          tabChangeValue={props.tabChangeValue}
          setTabChangeValue={props.setTabChangeValue}
          majorvalidationscapitation={props.majorValidations}
          ref={capitationTabRef}
          auditProps={props.auditProps}
          errors={props.errors}
        />
      ) : (
        ''
      )}

      <div className="tabs-container mt-3">
        {success ? (
          <div className="alert alert-success custom-alert" role="alert">
            {ErrorConst.SUCCESSFULLY_SAVED_INFORMATION}
          </div>
        ) : null}
        {deleteSuccess ? (
          <div className="alert alert-success custom-alert" role="alert">
            {ErrorConst.BENIFIT_PLAN_DELETE_SUCCESS}
          </div>
        ) : null}
        {providerNetOneErr ? (
          <div className="alert alert-danger custom-alert" role="alert">
            {ErrorConst.Provider_network_Error}
          </div>
        ) : null}
        <div className="tab-header">
          <h3 className="tab-heading float-left">
            Benefit Plan - Provider Network Connection
          </h3>
          <div className="float-right th-btnGroup">
            <Button
              title="Delete"
              data-test="test_trash_btn"
              variant="outlined"
              color="primary"
              className="btn btn-transparent btn-icon-only"
              disabled={selectDeleteArray.length == 0}
              onClick={() => {
                setDialogOpen(true);
                setDialogType('multiDelete');
              }}
            >
              <i className="fa fa-trash" />
            </Button>
            <Button
              title="Add Network Association"
              data-test="test_addNetAss_btn"
              variant="outlined"
              color="primary"
              className="btn btn-secondary btn-icon-only"
              data-testid="add_form"
              onClick={() => {
                if (props.majorValidations()) {
                  props.setTabChangeValue({
                    ...props.tabChangeValue,
                    mainTab: true,
                  });
                  setbanifitPlan(true);
                  setSuccess(false);
                  setDeleteSuccess(false);
                  setProviderNetOneErr(false);
                  props.seterrorMessages([]);
                  setShowError(false);
                  //setDeleteSuccess({networkDelete:false,providerDelete:false});
                  setnewProviderDate({
                    beginDate: '',
                    endDate: '12/31/9999',
                    netWorkId: '-1',
                    netWorkStatus: '-1',
                    rank: '',
                    netWorkSateDesc: '',
                  });
                  setresetProviderDate({
                    beginDate: '',
                    endDate: '12/31/9999',
                    netWorkId: '-1',
                    netWorkStatus: '-1',
                    rank: '',
                    netWorkSateDesc: '',
                  });
                  MBPscrolltoView();
                }
              }}
              disabled={isReadOnly()}
            >
              <i className="fa fa-plus" />
            </Button>
          </div>
          <div className="clearfix" />
        </div>

        <div className="tab-holder mt-2">
          <BenfitTabelComponent
            tabelRowData={props.newState}
            seterrorMessages={props.seterrorMessages}
            setShowError={setShowError}
            setSuccess={setSuccess}
            setnewProviderDate={setnewProviderDate}
            setbanifitPlan={setbanifitPlan}
            setresetProviderDate={setresetProviderDate}
            selectDeleteArray={selectDeleteArray}
            setSelectDeleteArray={setSelectDeleteArray}
            setTabChangeValue={props.setTabChangeValue}
            MBPscrolltoView={MBPscrolltoView}
            auditProps={props.auditProps}
          />
        </div>
        {banifitPlan ? (
          <>
            <div className="mt-0" ref={addnetassotiationrefs}>
              <div className="tab-header">
                <h3 className="tab-heading float-left">
                  {newProviderDate.index > -1
                    ? 'Edit Provider Network Association'
                    : 'New Provider Network Association'}
                </h3>
                <div className="float-right th-btnGroup">
                  <Button
                    title={newProviderDate.index > -1 ? 'Update' : 'Add'}
                    variant="outlined"
                    color="primary"
                    className={
                      newProviderDate.index > -1
                        ? 'btn btn-ic btn-update'
                        : 'btn btn-ic btn-add'
                    }
                    onClick={() => handelClick()}
                    disabled={isReadOnlyAccess}
                    data-testid="test_add_btn"
                  >
                    {newProviderDate.index > -1 ? 'Update' : 'Add'}
                  </Button>
                  {newProviderDate.index > -1 ? (
                    <Button
                      onClick={() => navigateToNetworkDetails(newProviderDate)}
                      title="View/Edit Network"
                      data-test="test_viewNetwork"
                      color="primary"
                      className="btn btn-ic btn-view"
                      disabled={isReadOnlyAccess}
                    >
                      View/Edit Network
                    </Button>
                  ) : null}
                  {newProviderDate.index > -1 ? (
                    <Button
                      title="Delete"
                      variant="outlined"
                      data-test="test_delete_btn"
                      color="primary"
                      className="btn btn-ic btn-delete"
                      onClick={() => {
                        setDialogOpen(true);
                        setDialogType('Delete');
                      }}
                      disabled={isReadOnlyAccess}
                    >
                      Delete
                    </Button>
                  ) : null}
                  <Button
                    title="Reset"
                    data-test="test_reset_btn"
                    variant="outlined"
                    color="primary"
                    className="btn btn-ic btn-reset"
                    onClick={() => handelResetClick()}
                    disabled={isReadOnlyAccess}
                  >
                    Reset
                  </Button>
                  <Button
                    title="Cancel"
                    variant="outlined"
                    data-test="test_cancel_btn"
                    color="primary"
                    className="btn btn-cancel"
                    onClick={() => {
                      setDialogOpen(true);
                      setDialogType('Cancel');
                      setProviderNetOneErr(false);
                      props.setTabChangeValue({
                        ...props.tabChangeValue,
                        mainTab: false,
                      });
                    }}
                    disabled={isReadOnlyAccess}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <form autoComplete="off">
                <div className="tab-body-bordered mt-2">
                  <div className="form-wrapper">
                    <div className="flex-block">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div className="mui-custom-form input-md with-select">
                          <KeyboardDatePicker
                            required
                            id="begin_date_net_association_bp_tab"
                            data-test="test_beginDate"
                            label="Begin Date"
                            format="MM/dd/yyyy"
                            data-testid="benefitPlanBeginDate"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="mm/dd/yyyy"
                            maxDate={new Date('9999-12-31T13:00:00.000+0000')}
                            value={
                              !newProviderDate.beginDate ||
                              newProviderDate.beginDate == ''
                                ? null
                                : newProviderDate.beginDate
                            }
                            onChange={handelDateChange(
                              'setnewProviderDate',
                              'beginDate'
                            )}
                            helperText={
                              //showHeaderDateErr
                              showBeginDateError
                                ? ErrorConst.BEGIN_DATE_ERROR
                                : showHeaderBeginDateErr
                                ? ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk
                                : beginDtInvalidErr
                                ? ErrorConst.Invalid_Begin_Date_Error
                                : showBgdtGTEnddtErr
                                ? ErrorConst.Date_Range_Error
                                : null
                            }
                            error={
                              //showHeaderDateErr
                              showBeginDateError
                                ? ErrorConst.BEGIN_DATE_ERROR
                                : showHeaderBeginDateErr
                                ? ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk
                                : beginDtInvalidErr
                                ? ErrorConst.Invalid_Begin_Date_Error
                                : showBgdtGTEnddtErr
                                ? ErrorConst.Date_Range_Error
                                : null
                            }
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            disabled={isReadOnlyAccess}
                          />
                        </div>
                      </MuiPickersUtilsProvider>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div className="mui-custom-form input-md with-select">
                          <KeyboardDatePicker
                            required
                            id="begin_date_net_association_bp_tab2"
                            data-test="test_endDate"
                            label="End Date"
                            format="MM/dd/yyyy"
                            maxDate={new Date('9999-12-31T13:00:00.000+0000')}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="mm/dd/yyyy"
                            value={
                              !newProviderDate.endDate ||
                              newProviderDate.endDate == ''
                                ? null
                                : newProviderDate.endDate
                            }
                            onChange={handelDateChange(
                              'setnewProviderDate',
                              'endDate'
                            )}
                            helperText={
                              showEndDateError
                                ? ErrorConst.END_DATE_ERROR
                                : showHeaderEndDateErr
                                ? ErrorConst.Fall_In_Header_End_Date_Err
                                : endDtInvalidErr
                                ? ErrorConst.Invalid_End_Date_Error
                                : null
                            }
                            error={
                              showEndDateError
                                ? ErrorConst.END_DATE_ERROR
                                : showHeaderEndDateErr
                                ? ErrorConst.Fall_In_Header_End_Date_Err
                                : endDtInvalidErr
                                ? ErrorConst.Invalid_End_Date_Error
                                : null
                            }
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            disabled={isReadOnlyAccess}
                          />
                        </div>
                      </MuiPickersUtilsProvider>
                    </div>
                    <div className="flex-block">
                      <NativeDropDown
                        id="network_id_bp_tab"
                        data-test="test_network_id_bp_tab"
                        label="Network ID"
                        inputProps={{ maxLength: 2 }}
                        value={
                          !newProviderDate.netWorkId ||
                          newProviderDate.netWorkId === ''
                            ? null
                            : newProviderDate.netWorkId
                        }
                        name="netWorkId"
                        onChange={event => handelInputChange(event)}
                        dropdownList={networkIDDrpDwn}
                        isRequired={true}
                        errTxt={
                          networkIDError ? ErrorConst.Network_ID_Error : null
                        }
                        disabled={isReadOnlyAccess}
                      />

                      <NativeDropDown
                        id="network_status_bp_tab"
                        data-test="test_ntworkStatus_tab"
                        label="Network Status"
                        inputProps={{ maxLength: 2 }}
                        value={newProviderDate.netWorkStatus}
                        name="netWorkStatus"
                        onChange={event => handelInputChange(event)}
                        dropdownList={networkStatusDrpDwn}
                        isRequired={true}
                        errTxt={
                          networkStatusError
                            ? ErrorConst.Network_Status_Error
                            : null
                        }
                        disabled={isReadOnlyAccess}
                      />

                      <div className="mui-custom-form with-select input-md">
                        <TextField
                          data-testid="rank"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          name="rank"
                          label="Rank"
                          onChange={event => handelInputChange(event)}
                          //onChange={props.handleChanges('rank')}
                          inputProps={{ maxLength: 5 }}
                          value={newProviderDate.rank}
                          helperText={
                            rankError
                              ? ErrorConst.Rank_Error
                              : RankErr
                              ? ErrorConst.RANK_TABLE_OVERLAP
                              : showRankErrSpe
                              ? ErrorConst.BENEFIT_PLAN_RANKING_ZERO_ERROR
                              : showRankErrZero
                              ? ErrorConst.BENEFIT_PLAN_RANKING_ZERO
                              : showRankOverlapErr
                              ? ErrorConst.RANK_TABLE_OVERLAP
                              : null
                          }
                          error={
                            rankError
                              ? ErrorConst.Rank_Error
                              : RankErr
                              ? ErrorConst.RANK_TABLE_OVERLAP
                              : showRankErrSpe
                              ? ErrorConst.BENEFIT_PLAN_RANKING_ZERO_ERROR
                              : showRankErrZero
                              ? ErrorConst.BENEFIT_PLAN_RANKING_ZERO
                              : showRankOverlapErr
                              ? ErrorConst.RANK_TABLE_OVERLAP
                              : null
                          }
                          id="rank_bp_tab"
                          disabled={isReadOnlyAccess}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {props.auditProps &&
            props.auditProps.showAuditLog &&
            newProviderDate.index > -1 ? (
              <>
                <AuditLogRow
                  auditLogData={
                    props.auditProps.subAuditLogData &&
                    props.auditProps.subAuditLogData[
                      AuditConstant.AUDIT_LOG_BP_NW_ASCN
                    ]
                      ? props.auditProps.subAuditLogData[
                          AuditConstant.AUDIT_LOG_BP_NW_ASCN
                        ]
                      : []
                  }
                />
              </>
            ) : (
              ''
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
export default withRouter(forwardRef(MainbenifitPlan));
