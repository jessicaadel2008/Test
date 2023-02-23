import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import dateFnsFormat from 'date-fns/format';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as moment from 'moment';
import 'moment-range';
import * as ErrorConst from '../../../SharedModules/Messages/ErrorMsgConstants';
import CoveragTableComponent from './CoveragTableComponent';
import * as serviceEndPoint from '../../../SharedModules/services/service';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Link } from 'react-router-dom';
import isSpecialcharecter from './validations';
import AuditLogRow from '../../../SharedModules/AuditLog/AuditLogRow';
import * as AuditConstant from '../../../SharedModules/AuditLog/AuditLogConstants';
import { getLoginUserDetails } from '../../../SharedModules/utility/utilityFunction';
import NativeDropDown from '../../../SharedModules/Dropdowns/NativeDropDown';
import { isReadOnly } from '../../../SharedModules/utility/utilityFunction';

function BenifitPlanCoverage(props, ref) {
  console.log('props:', props);

  const userDetails = getLoginUserDetails();
  let reqFieldArr = [];
  const { covBenefitPlan, setCovBenefitPlan } = props;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [successMessages, setSuccessMessages] = React.useState([]);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);
  const [selectDeleteArray, setSelectDeleteArray] = React.useState([]);
  const [resetCoveragePlan, setresetCoveragePlan] = React.useState({
    beginDate: '',
    endDate: '',
    mapSetID: '-1',
    benefitPlanNetworkStatusCode: '',
    seqNum: '',
    coverageInd: '1',
    exceptionCode: '',
    bpNWStatusCodeDesc: '',
  });
  const [newCoveragePlan, setnewCoveragePlan] = React.useState({
    beginDate: '',
    endDate: '12/31/9999',
    mapSetID: '-1',
    // mapSetIdDesc:'',
    benefitPlanNetworkStatusCode: '',
    seqNum: '',
    coverageInd: '1',
    exceptionCode: '',
    bpNWStatusCodeDesc: '',
  });
  const [selectedCovEndDate, setSelectedCovEndDate] = React.useState('');
  const [selectedCovBeginDate, setSelectedCovBeginDate] = React.useState('');
  const [spinnerLoader, setspinnerLoader] = React.useState(false);
  const [
    {
      showHeaderDateErr,
      showBeginDateError,
      showEndDateError,
      beginDtInvalidErr,
      endDtInvalidErr,
      showRankOverlapErr,
      showNetworkOverlapErr,
      networkStatusError,
      mapIdErr,
      rankError,
      showBgdtGTEnddtErr,
      showRankErrZero,
      RankErr,
      INVALID_LMT_MET_EXC_CODE,
      INVALID_LMT_MET_EXC_CODE_SPL,
      showHeaderEndDateErr,
    },
    setShowError,
  ] = React.useState(false);

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

  const formatCovDate = dt => {
    dt = new Date(dt);
    if (dt.toString() == 'Invalid Date') {
      return dt;
    } else {
      return dateFnsFormat(dt, 'MM/dd/yyyy');
    }
  };

  const handelDateRngeWithin = (
    rangeStartDate,
    rangeEndDate,
    withInStartDate,
    withInEndDate
  ) => {
    if (rangeStartDate && rangeEndDate && withInStartDate && withInEndDate) {
      const range = moment().range(
        new Date(rangeStartDate),
        new Date(rangeEndDate)
      );
      return (
        range.contains(new Date(withInStartDate)) &&
        range.contains(new Date(withInEndDate))
      );
    }
    return false;
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
    networkstatus,
    inputArray
  ) => {
    if (inputArray.length > 0) {
      const result = inputArray.map(each => {
        if (
          handelDateRngeOverlap(
            initalStartDate,
            initialEndDate,
            each.beginDate,
            each.endDate
          )
        ) {
          if (
            each.mapSetID == networkId &&
            each.benefitPlanNetworkStatusCode == networkstatus &&
            each.beginDate == initalStartDate
          ) {
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
            each.endDate
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

  const handleCoverageBeginDateChange = d => {
    setSelectedCovBeginDate(d);
    let finaldate = formatCovDate(d);
    props.handleCovDtChange('beginDate', finaldate);
  };

  const handleCoverageEndDateChange = d => {
    setSelectedCovEndDate(d);
    let finaldate = formatCovDate(d);
    props.handleCovDtChange('endDate', finaldate);
  };

  const handelInputChange = event => {
    props.setTabChangeValue({ ...props.tabChangeValue, coverageTab: true });
    if (event.target.name === 'benefitPlanNetworkStatusCode') {
      setnewCoveragePlan({
        ...newCoveragePlan,
        [event.target.name]: event.target.value,
        bpNWStatusCodeDesc:
          event.nativeEvent.target[event.nativeEvent.target.selectedIndex].text,
      });
    } else {
      setnewCoveragePlan({
        ...newCoveragePlan,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handelDateChange = (type, name) => date => {
    props.setTabChangeValue({ ...props.tabChangeValue, coverageTab: true });
    if (type === 'setnewCoveragePlan') {
      setnewCoveragePlan({ ...newCoveragePlan, [name]: formatDate(date) });
    }
  };

  const validateExcCode = c => {
    return new Promise((resolve, reject) => {
      setspinnerLoader(true);
      axios
        .get(
          serviceEndPoint.BENEFIT_PLAN_EXC_CODE_VALIDATION +
            c +
            '/' +
            props.formValues.lobId
        )
        .then(response => {
          if (response.data.data && response.data.data.excCodeDesc) {
            resolve(response.data.data.excCodeDesc);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          resolve(false);
        })
        .then(() => {
          setspinnerLoader(false);
        });
    });
  };
  const networkDrpDwn =
    props.dropdowns &&
    props.dropdowns['R1#R_BP_NW_STAT_CD'] &&
    props.dropdowns['R1#R_BP_NW_STAT_CD'].map(each => (
      <option selected key={each.code} value={each.code}>
        {each.description}
      </option>
    ));
  const mapIDDrpDwn =
    props.mapIdDropdown &&
    props.mapIdDropdown.map(each => (
      <option selected key={each.mapsetId} value={each.mapsetId}>
        {each.mapsetId}-{each.mapDesc}
      </option>
    ));

  const handelClick = async () => {
    const tableData = props.newCovState;
    //webninja
    let errors = {};
    reqFieldArr = [];
    setSuccess(false);
    setDeleteSuccess(false);
    props.seterrorMessages([]);
    setSuccessMessages([]);
    let overlapArray;
    if (newCoveragePlan.index > -1) {
      overlapArray = tableData.filter(
        e =>
          e.beginDate != formatDate(resetCoveragePlan.beginDate) ||
          e.endDate != formatDate(resetCoveragePlan.endDate) ||
          e.seqNum != resetCoveragePlan.seqNum
      );
    } else {
      overlapArray = tableData;
    }
    const headerTange = await handelDateRngeWithin(
      formatDate(props.formValues.beginDate),
      formatDate(props.formValues.endDate),
      formatDate(newCoveragePlan.beginDate),
      formatDate(newCoveragePlan.endDate)
    );
    const networkOverlap = await handelDateNetworkArrayOverlap(
      formatDate(newCoveragePlan.beginDate),
      formatDate(newCoveragePlan.endDate),
      newCoveragePlan.mapSetID,
      newCoveragePlan.benefitPlanNetworkStatusCode,
      overlapArray
    );
    const rankOverlap = await handelDateRankArrayOverlap(
      formatDate(newCoveragePlan.beginDate),
      formatDate(newCoveragePlan.endDate),
      newCoveragePlan.seqNum,
      overlapArray
    );
    setShowError({
      showBeginDateError: newCoveragePlan.beginDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Begin_Date_Error);
            return true;
          })(),
      showEndDateError: newCoveragePlan.endDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.End_Date_Error);
            return true;
          })(),
      beginDtInvalidErr:
        formatDate(newCoveragePlan.beginDate).toString() == 'Invalid Date'
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_Begin_Date_Error);
              return true;
            })()
          : false,
      endDtInvalidErr:
        formatDate(newCoveragePlan.endDate).toString() == 'Invalid Date'
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_End_Date_Error);
              return true;
            })()
          : false,
      mapIdErr:
        newCoveragePlan.mapSetID && newCoveragePlan.mapSetID != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Map_Id_Error);
              return true;
            })(),
      networkStatusError:
        newCoveragePlan.benefitPlanNetworkStatusCode &&
        newCoveragePlan.benefitPlanNetworkStatusCode != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Network_Status_Error);
              return true;
            })(),
      rankError: newCoveragePlan.seqNum
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Rank_Error);
            return true;
          })(),
      showBgdtGTEnddtErr:
        newCoveragePlan.endDate &&
        new Date(newCoveragePlan.beginDate).setHours(0, 0, 0) >
          new Date(newCoveragePlan.endDate).setHours(0, 0, 0)
          ? (() => {
              reqFieldArr.push(ErrorConst.Date_Range_Error);
              return true;
            })()
          : false,
      RankErr: !(
        isNaN(newCoveragePlan.seqNum) ||
        parseInt(newCoveragePlan.seqNum) > 99999
      )
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Invalid_Rank_Error);
            return true;
          })(),
      showRankErrZero:
        newCoveragePlan.seqNum < 1 && newCoveragePlan.seqNum.length
          ? (() => {
              reqFieldArr.push(ErrorConst.BENEFIT_PLAN_RANKING_ZERO);
              return true;
            })()
          : false,
      showHeaderDateErr: newCoveragePlan.beginDate
        ? new Date(newCoveragePlan.beginDate) <
            new Date(formatDate(props.formValues.beginDate)) ||
          new Date(newCoveragePlan.beginDate) >
            new Date(formatDate(props.formValues.endDate))
          ? (() => {
              reqFieldArr.push(
                ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk
              );
              return true;
            })()
          : false
        : false,

      showHeaderEndDateErr:
        newCoveragePlan.endDate &&
        !(
          new Date(newCoveragePlan.endDate) <=
          new Date(formatDate(props.formValues.endDate))
        )
          ? (() => {
              reqFieldArr.push(ErrorConst.Fall_In_Header_End_Date_Err);
              return true;
            })()
          : false,
      showNetworkOverlapErr:
        newCoveragePlan.beginDate &&
        newCoveragePlan.endDate &&
        newCoveragePlan.mapSetID &&
        newCoveragePlan.benefitPlanNetworkStatusCode &&
        networkOverlap
          ? (() => {
              reqFieldArr.push(ErrorConst.NETWORK_MAP_OVERLAP);
              return true;
            })()
          : false,
      showRankOverlapErr:
        newCoveragePlan.beginDate &&
        newCoveragePlan.endDate &&
        newCoveragePlan.seqNum &&
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

    let clmExcnDesc = '';
    if (newCoveragePlan.exceptionCode) {
      if (isSpecialcharecter(newCoveragePlan.exceptionCode)) {
        errors['INVALID_LMT_MET_EXC_CODE_SPL'] = true;
        reqFieldArr.push(ErrorConst.INVALID_SPL_EXC_CODE);
      } else {
        let clmExcnDesc = await validateExcCode(newCoveragePlan.exceptionCode);
        if (!clmExcnDesc) {
          errors['INVALID_LMT_MET_EXC_CODE'] = true;
          reqFieldArr.push(ErrorConst.INVALID_EXC_CODE);
        }
      }
    }

    if (reqFieldArr.length) {
      setShowError(errors);
      props.seterrorMessages(reqFieldArr);
      return false;
    }

    const data = {
      auditUserID: userDetails.loginUserID,
      auditTimeStamp: new Date(),
      addedAuditUserID: userDetails.loginUserID,
      addedAuditTimeStamp: new Date(),
      versionNo:
        newCoveragePlan.row && newCoveragePlan.row.versionNo
          ? newCoveragePlan.row.versionNo
          : 0,
      dbRecord:
        newCoveragePlan.row && newCoveragePlan.row.dbRecord
          ? newCoveragePlan.row.dbRecord
          : false,
      sortColumn:
        newCoveragePlan.row && newCoveragePlan.row.sortColumn
          ? newCoveragePlan.row.sortColumn
          : null,
      auditKeyList:
        newCoveragePlan.row && newCoveragePlan.row.auditKeyList
          ? newCoveragePlan.row.auditKeyList
          : [],
      auditKeyListFiltered:
        newCoveragePlan.row && newCoveragePlan.row.auditKeyListFiltered
          ? newCoveragePlan.row.auditKeyListFiltered
          : false,
      beginDate: formatDate(newCoveragePlan.beginDate),
      seqNum: newCoveragePlan.seqNum,
      benefitPlanNetworkStatusCode:
        newCoveragePlan.benefitPlanNetworkStatusCode,
      endDate: formatDate(newCoveragePlan.endDate),
      mapSetID: newCoveragePlan.mapSetID,
      coverageInd: newCoveragePlan.coverageInd,
      exceptionCode: newCoveragePlan.exceptionCode,
      benefitPlan: null,
      clmExcnDesc: clmExcnDesc ? clmExcnDesc : '',
      bpNWStatusCodeDesc: newCoveragePlan.bpNWStatusCodeDesc,
      benefitPlanCoverageID:
        newCoveragePlan.row && newCoveragePlan.row.benefitPlanCoverageID
          ? newCoveragePlan.row.benefitPlanCoverageID
          : null,
    };
    newCoveragePlan.index > -1
      ? (tableData[newCoveragePlan.index] = data)
      : tableData.push(data);

    props.setNewCovState(tableData);
    setSuccess(true);
    setnewCoveragePlan({
      beginDate: '',
      endDate: '',
      mapSetID: '',
      benefitPlanNetworkStatusCode: '',
      seqNum: '',
      coverageInd: '1',
      exceptionCode: '',
      bpNWStatusCodeDesc: '',
    });
    setresetCoveragePlan({
      beginDate: '',
      endDate: '',
      mapSetID: '',
      benefitPlanNetworkStatusCode: '',
      seqNum: '',
      coverageInd: '1',
      exceptionCode: '',
      bpNWStatusCodeDesc: '',
    });
    setCovBenefitPlan(false);
    props.setTabChangeValue({ ...props.tabChangeValue, coverageTab: false });
  };

  const handelResetClick = () => {
    props.seterrorMessages([]);
    setnewCoveragePlan(resetCoveragePlan);
    setShowError(false);
    props.setTabChangeValue({ ...props.tabChangeValue, coverageTab: false });
  };

  const handelCandelFunction = () => {
    setCovBenefitPlan(false);
    setShowError(false);
    setDialogOpen(false);
    setDialogType('');
  };

  const handelDeleteClick = () => {
    setSuccess(false);
    const tableData = props.newCovState;
    if (newCoveragePlan.row && newCoveragePlan.row.benefitPlanCoverageID) {
      let deleteData = props.deleteCovRow;
      deleteData.push({
        auditUserID: newCoveragePlan.row.auditUserID,
        auditTimeStamp: newCoveragePlan.row.auditTimeStamp,
        addedAuditUserID: newCoveragePlan.row.addedAuditUserID,
        addedAuditTimeStamp: newCoveragePlan.row.addedAuditTimeStamp,
        versionNo: newCoveragePlan.row.versionNo,
        dbRecord: false,
        sortColumn: null,
        auditKeyList: [],
        auditKeyListFiltered: false,
        beginDate: formatDate(newCoveragePlan.beginDate),
        endDate: formatDate(newCoveragePlan.endDate),
        seqNum: newCoveragePlan.seqNum,
        benefitPlanNetworkStatusCode:
          newCoveragePlan.benefitPlanNetworkStatusCode,
        mapSetID: newCoveragePlan.mapSetID,
        coverageInd: newCoveragePlan.coverageInd,
        exceptionCode: newCoveragePlan.exceptionCode,
        benefitPlan: null,
        clmExcnDesc: '',
        bpNWStatusCodeDesc: newCoveragePlan.bpNWStatusCodeDesc,
        benefitPlanCoverageID: newCoveragePlan.row.benefitPlanCoverageID,
      });
      props.setDeleteCovRow(deleteData);
    }
    tableData.splice(newCoveragePlan.index, 1);
    props.setNewCovState(tableData);
    setShowError(false);
    setnewCoveragePlan({
      beginDate: '',
      endDate: '',
      mapSetID: '',
      benefitPlanNetworkStatusCode: '',
      seqNum: '',
      coverageInd: '1',
      exceptionCode: '',
      bpNWStatusCodeDesc: '',
    });
    setresetCoveragePlan({
      beginDate: '',
      endDate: '12/31/9999',
      mapSetID: '',
      benefitPlanNetworkStatusCode: '',
      seqNum: '',
      coverageInd: '1',
      exceptionCode: '',
      bpNWStatusCodeDesc: '',
    });
    setCovBenefitPlan(false);
    setDialogOpen(false);
    setDialogType('');
    setDeleteSuccess(true);
  };
  const scrollToRef = ref => ref.current.scrollIntoView({ behavior: 'smooth' });
  const addBPcoveragescroll = useRef(null);
  const BPscrolltoView = () => {
    setTimeout(
      function () {
        scrollToRef(addBPcoveragescroll);
      }.bind(this),
      1000
    );
  };

  const multiDelete = () => {
    setDialogOpen(false);
    setDialogType('');
    props.seterrorMessages([]);
    setSuccess(false);
    setSuccessMessages([]);
    if (selectDeleteArray.length > 0) {
      let CI = props.newCovState;
      selectDeleteArray.map((value, index) => {
        let curIndex = CI.findIndex(i =>
          moment(i.beginDate).isSame(value.beginDate)
        );
        CI.splice(curIndex, 1);
      });
      props.setNewCovState(CI);
      props.setDeleteCovRow(selectDeleteArray);
      setSelectDeleteArray([]);
      setDeleteSuccess(true);
    }
  };

  useImperativeHandle(ref, () => {
    return { validateFn };
  });

  const validateFn = () => {
    if (props.tabChangeValue.coverageTab) {
      handelSaveValidations();
    }
  };

  const handelSaveValidations = async () => {
    const tableData = props.newCovState;
    //webninja
    setSuccess(false);
    setDeleteSuccess(false);
    props.seterrorMessages([]);
    setSuccessMessages([]);
    let reqFieldArr = [];
    let overlapArray;
    let errors = {};
    if (newCoveragePlan.index > -1) {
      overlapArray = tableData.filter(
        e =>
          e.beginDate != formatDate(resetCoveragePlan.beginDate) ||
          e.endDate != formatDate(resetCoveragePlan.endDate) ||
          e.seqNum != resetCoveragePlan.seqNum
      );
    } else {
      overlapArray = tableData;
    }
    const headerTange = await handelDateRngeWithin(
      formatDate(props.formValues.beginDate),
      formatDate(props.formValues.endDate),
      formatDate(newCoveragePlan.beginDate),
      formatDate(newCoveragePlan.endDate)
    );
    const networkOverlap = await handelDateNetworkArrayOverlap(
      formatDate(newCoveragePlan.beginDate),
      formatDate(newCoveragePlan.endDate),
      newCoveragePlan.mapSetID,
      newCoveragePlan.benefitPlanNetworkStatusCode,
      overlapArray
    );
    const rankOverlap = await handelDateRankArrayOverlap(
      formatDate(newCoveragePlan.beginDate),
      formatDate(newCoveragePlan.endDate),
      newCoveragePlan.seqNum,
      overlapArray
    );
    setShowError({
      showBeginDateError: newCoveragePlan.beginDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Begin_Date_Error);
            return true;
          })(),
      showEndDateError: newCoveragePlan.endDate
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.End_Date_Error);
            return true;
          })(),
      beginDtInvalidErr:
        formatDate(newCoveragePlan.beginDate).toString() == 'Invalid Date'
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_Begin_Date_Error);
              return true;
            })()
          : false,
      endDtInvalidErr:
        formatDate(newCoveragePlan.endDate).toString() == 'Invalid Date'
          ? (() => {
              reqFieldArr.push(ErrorConst.Invalid_End_Date_Error);
              return true;
            })()
          : false,
      mapIdErr:
        newCoveragePlan.mapSetID && newCoveragePlan.mapSetID != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Map_Id_Error);
              return true;
            })(),
      networkStatusError:
        newCoveragePlan.benefitPlanNetworkStatusCode &&
        newCoveragePlan.benefitPlanNetworkStatusCode != -1
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Network_Status_Error);
              return true;
            })(),
      rankError: newCoveragePlan.seqNum
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Rank_Error);
            return true;
          })(),
      showBgdtGTEnddtErr:
        new Date(newCoveragePlan.beginDate) <= new Date(newCoveragePlan.endDate)
          ? false
          : (() => {
              reqFieldArr.push(ErrorConst.Date_Range_Error);
              return true;
            })(),
      RankErr: !(
        isNaN(newCoveragePlan.seqNum) ||
        parseInt(newCoveragePlan.seqNum) > 99999
      )
        ? false
        : (() => {
            reqFieldArr.push(ErrorConst.Invalid_Rank_Error);
            return true;
          })(),
      showRankErrZero:
        newCoveragePlan.seqNum < 1 && newCoveragePlan.seqNum.length
          ? (() => {
              reqFieldArr.push(ErrorConst.BENEFIT_PLAN_RANKING_ZERO);
              return true;
            })()
          : false,
      // showHeaderDateErr: !headerTange && newCoveragePlan.beginDate? (()=>{reqFieldArr.push(ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk);return true;})() : false,
      showHeaderDateErr: newCoveragePlan.beginDate
        ? !(
            new Date(newCoveragePlan.beginDate) >=
              new Date(formatDate(props.formValues.beginDate)) &&
            new Date(newCoveragePlan.beginDate) <=
              new Date(formatDate(props.formValues.endDate))
          )
          ? (() => {
              reqFieldArr.push(
                ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk
              );
              return true;
            })()
          : false
        : false,

      showHeaderEndDateErr: !(
        new Date(newCoveragePlan.endDate) <= new Date(props.formValues.endDate)
      )
        ? (() => {
            reqFieldArr.push(ErrorConst.Fall_In_Header_End_Date_Err);
            return true;
          })()
        : false,
      showNetworkOverlapErr:
        newCoveragePlan.beginDate &&
        newCoveragePlan.endDate &&
        newCoveragePlan.mapSetID &&
        newCoveragePlan.benefitPlanNetworkStatusCode &&
        networkOverlap
          ? (() => {
              reqFieldArr.push(ErrorConst.NETWORK_MAP_OVERLAP);
              return true;
            })()
          : false,
      showRankOverlapErr:
        newCoveragePlan.beginDate &&
        newCoveragePlan.endDate &&
        newCoveragePlan.seqNum &&
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

    let clmExcnDesc = '';
    if (newCoveragePlan.exceptionCode) {
      if (isSpecialcharecter(newCoveragePlan.exceptionCode)) {
        errors['INVALID_LMT_MET_EXC_CODE_SPL'] = true;
        reqFieldArr.push(ErrorConst.INVALID_SPL_EXC_CODE);
      } else {
        let clmExcnDesc = await validateExcCode(newCoveragePlan.exceptionCode);
        if (!clmExcnDesc) {
          errors['INVALID_LMT_MET_EXC_CODE'] = true;
          reqFieldArr.push(ErrorConst.INVALID_EXC_CODE);
        }
      }
    }

    if (reqFieldArr.length) {
      setShowError(errors);
      props.seterrorMessages(reqFieldArr);
      return false;
    }
  };

  const isReadOnlyAccess = isReadOnly();
  return (
    <>
      <div className="pos-relative">{/*webninja*/}</div>
      <Dialog
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
      <div className="tabs-container pt-3">
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
        <div className="tab-header">
          <h3 className="tab-heading float-left">Benefit Plan - Coverage</h3>
          <div className="float-right th-btnGroup">
            <Button
              title="Delete"
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
              data-test="test_add_btn"
              title="Add Coverage"
              variant="outlined"
              color="primary"
              className="btn btn-secondary btn-icon-only"
              onClick={() => {
                if (props.majorValidations()) {
                  props.setTabChangeValue({
                    ...props.tabChangeValue,
                    coverageTab: true,
                  });
                  props.seterrorMessages([]);
                  setShowError(false);
                  setCovBenefitPlan(true);
                  setSuccess(false);
                  setDeleteSuccess(false);
                  setnewCoveragePlan({
                    beginDate: '',
                    endDate: '12/31/9999',
                    mapSetID: '-1',
                    benefitPlanNetworkStatusCode: '-1',
                    seqNum: '',
                    coverageInd: '1',
                    exceptionCode: '',
                    bpNWStatusCodeDesc: '',
                  });
                  setresetCoveragePlan({
                    beginDate: '',
                    endDate: '12/31/9999',
                    mapSetID: '-1',
                    benefitPlanNetworkStatusCode: '-1',
                    seqNum: '',
                    coverageInd: '1',
                    exceptionCode: '',
                    bpNWStatusCodeDesc: '',
                  });
                  BPscrolltoView();
                }
              }}
              disabled={isReadOnlyAccess}
            >
              <i className="fa fa-plus" />
            </Button>
          </div>
          <div className="clearfix" />
        </div>

        <div className="tab-holder mt-2">
          <CoveragTableComponent
            setSuccess={setSuccess}
            seterrorMessages={props.seterrorMessages}
            setShowError={setShowError}
            tabelRowData={props.newCovState}
            setnewCoveragePlan={setnewCoveragePlan}
            setCovBenefitPlan={setCovBenefitPlan}
            setresetCoveragePlan={setresetCoveragePlan}
            selectDeleteArray={selectDeleteArray}
            setSelectDeleteArray={setSelectDeleteArray}
            setTabChangeValue={props.setTabChangeValue}
            BPscrolltoView={BPscrolltoView}
            auditProps={props.auditProps}
          />
        </div>
      </div>

      {covBenefitPlan ? (
        <>
          <div
            className="tabs-container tabs-container-inner mt-0"
            ref={addBPcoveragescroll}
          >
            <div className="tab-header">
              <h3 className="tab-heading float-left">
                {newCoveragePlan.index > -1
                  ? 'Edit Coverage Plan'
                  : 'New Coverage Plan'}
              </h3>
              <div className="float-right th-btnGroup">
                <Button
                  title={newCoveragePlan.index > -1 ? 'Update' : 'Add'}
                  variant="outlined"
                  color="primary"
                  className={
                    newCoveragePlan.index > -1
                      ? 'btn btn-ic btn-update'
                      : 'btn btn-ic btn-add'
                  }
                  onClick={() => handelClick()}
                  disabled={
                    (props.privileges && !props.privileges.add) ||
                    isReadOnlyAccess
                      ? 'disabled'
                      : ''
                  }
                >
                  {newCoveragePlan.index > -1 ? 'Update' : 'Add'}
                </Button>
                {newCoveragePlan.index > -1 ? (
                  <Link
                    to={`MapSetSearch?id=${newCoveragePlan.mapSetID}`}
                    target="_blank"
                    title="View/Edit Map"
                    className="btn btn-ic btn-view"
                  >
                    View/Edit Map{' '}
                  </Link>
                ) : null}
                {newCoveragePlan.index > -1 ? (
                  <Button
                    title="Delete"
                    variant="outlined"
                    color="primary"
                    className="btn btn-ic btn-delete"
                    onClick={() => {
                      setDialogOpen(true);
                      setDialogType('Delete');
                    }}
                    disabled={
                      (props.privileges && !props.privileges.add) ||
                      isReadOnlyAccess
                        ? 'disabled'
                        : ''
                    }
                  >
                    Delete
                  </Button>
                ) : null}
                <Button
                  title="Reset"
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
                  color="primary"
                  className="btn btn-cancel"
                  onClick={() => {
                    setDialogOpen(true);
                    setDialogType('Cancel');
                    props.setTabChangeValue({
                      ...props.tabChangeValue,
                      coverageTab: false,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <div className="tab-body-bordered mt-2">
              <div className="form-wrapper">
                {/* <h1 className="tab-heading float-left">Batch Data</h1> */}
                <div className="flex-block">
                  <div className="mui-custom-form">
                    <label className="MuiFormLabel-root MuiInputLabel-shrink">
                      Covered
                    </label>
                    <div className="sub-radio mt-0">
                      <RadioGroup
                        row
                        aria-label="Cover"
                        name="coverageInd"
                        value={newCoveragePlan.coverageInd}
                        onChange={event => handelInputChange(event)}
                        InputLabelProps={{
                          shrink: true,
                          required: true,
                        }}
                        disabled={isReadOnlyAccess}
                      >
                        <FormControlLabel
                          id="yes_coverage_tab"
                          value="1"
                          control={<Radio color="primary" />}
                          label="Yes"
                        />
                        <FormControlLabel
                          id="no_coverage_tab"
                          value="0"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </div>
                  </div>

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <div
                      className="mui-custom-form input-md with-select"
                      style={{ marginLeft: '30px' }}
                    >
                      <KeyboardDatePicker
                        id="bgn_date_coverage_tab"
                        name="beginDate"
                        required
                        label="Begin Date"
                        format="MM/dd/yyyy"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="mm/dd/yyyy"
                        value={
                          !newCoveragePlan.beginDate ||
                          newCoveragePlan.beginDate == ''
                            ? null
                            : newCoveragePlan.beginDate
                        }
                        onChange={handelDateChange(
                          'setnewCoveragePlan',
                          'beginDate'
                        )}
                        helperText={
                          showBeginDateError
                            ? ErrorConst.BEGIN_DATE_ERROR
                            : showHeaderDateErr
                            ? ErrorConst.Fall_In_Header_Dates_Err_provider_ntwrk
                            : beginDtInvalidErr
                            ? ErrorConst.Invalid_Begin_Date_Error
                            : showBgdtGTEnddtErr
                            ? ErrorConst.Date_Range_Error
                            : null
                        }
                        error={
                          showBeginDateError
                            ? ErrorConst.BEGIN_DATE_ERROR
                            : showHeaderDateErr
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
                    <div
                      className="mui-custom-form input-md with-select"
                      style={{ marginLeft: '30px' }}
                    >
                      <KeyboardDatePicker
                        id="end_date_coverage_tab"
                        name="endDate"
                        required
                        label="End Date"
                        format="MM/dd/yyyy"
                        maxDate={new Date('9999-12-31T13:00:00.000+0000')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="mm/dd/yyyy"
                        value={
                          !newCoveragePlan.endDate ||
                          newCoveragePlan.endDate == ''
                            ? null
                            : newCoveragePlan.endDate
                        }
                        onChange={handelDateChange(
                          'setnewCoveragePlan',
                          'endDate'
                        )}
                        helperText={
                          showEndDateError
                            ? ErrorConst.END_DATE_ERROR
                            : endDtInvalidErr
                            ? ErrorConst.Invalid_End_Date_Error
                            : showHeaderEndDateErr
                            ? ErrorConst.Fall_In_Header_End_Date_Err
                            : null
                        }
                        error={
                          showEndDateError
                            ? ErrorConst.END_DATE_ERROR
                            : endDtInvalidErr
                            ? ErrorConst.Invalid_End_Date_Error
                            : showHeaderEndDateErr
                            ? ErrorConst.Fall_In_Header_End_Date_Err
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
                    id="network_status_coverage_tab"
                    label="Network Status"
                    inputProps={{ maxLength: 2 }}
                    value={newCoveragePlan.benefitPlanNetworkStatusCode}
                    name="benefitPlanNetworkStatusCode"
                    onChange={event => handelInputChange(event)}
                    dropdownList={networkDrpDwn}
                    isRequired={true}
                    errTxt={
                      networkStatusError
                        ? ErrorConst.Network_Status_Error
                        : null
                    }
                    disabled={isReadOnlyAccess}
                  />
                  <NativeDropDown
                    id="map_id_coverage_tab"
                    label="Map ID"
                    inputProps={{ maxLength: 2 }}
                    value={newCoveragePlan.mapSetID}
                    name="mapSetID"
                    onChange={event => handelInputChange(event)}
                    dropdownList={mapIDDrpDwn}
                    isRequired={true}
                    errTxt={mapIdErr ? ErrorConst.Map_Id_Error : null}
                    disabled={isReadOnlyAccess}
                  />

                  <div className="mui-custom-form with-select input-md">
                    <TextField
                      id="exception_code_coverage_tab"
                      name="exceptionCode"
                      label="Exception Code"
                      inputProps={{ maxLength: 4 }}
                      onChange={event => handelInputChange(event)}
                      value={newCoveragePlan.exceptionCode || ''}
                      helperText={
                        INVALID_LMT_MET_EXC_CODE
                          ? ErrorConst.INVALID_EXC_CODE
                          : INVALID_LMT_MET_EXC_CODE_SPL
                          ? ErrorConst.INVALID_SPL_EXC_CODE
                          : null
                      }
                      error={
                        INVALID_LMT_MET_EXC_CODE
                          ? ErrorConst.INVALID_EXC_CODE
                          : INVALID_LMT_MET_EXC_CODE_SPL
                          ? ErrorConst.INVALID_SPL_EXC_CODE
                          : null
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={isReadOnlyAccess}
                    ></TextField>
                  </div>
                  <div className="mui-custom-form with-select input-md">
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      name="seqNum"
                      onChange={event => handelInputChange(event)}
                      inputProps={{ maxLength: 5 }}
                      value={newCoveragePlan.seqNum}
                      helperText={
                        rankError
                          ? ErrorConst.Rank_Error
                          : RankErr
                          ? ErrorConst.Invalid_Rank_Error
                          : showRankOverlapErr
                          ? ErrorConst.RANK_TABLE_OVERLAP
                          : showRankErrZero
                          ? ErrorConst.BENEFIT_PLAN_RANKING_ZERO
                          : null
                      }
                      error={
                        rankError
                          ? ErrorConst.Rank_Error
                          : RankErr
                          ? ErrorConst.Invalid_Rank_Error
                          : showRankOverlapErr
                          ? ErrorConst.RANK_TABLE_OVERLAP
                          : showRankErrZero
                          ? ErrorConst.BENEFIT_PLAN_RANKING_ZERO
                          : null
                      }
                      id="rank_coverage_tab"
                      label="Rank"
                      disabled={isReadOnlyAccess}
                    ></TextField>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {props.auditProps &&
          props.auditProps.showAuditLog &&
          newCoveragePlan.index > -1 ? (
            <>
              <AuditLogRow
                auditLogData={
                  props.auditProps.subAuditLogData &&
                  props.auditProps.subAuditLogData[
                    AuditConstant.AUDIT_LOG_BP_CVRG
                  ]
                    ? props.auditProps.subAuditLogData[
                        AuditConstant.AUDIT_LOG_BP_CVRG
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
    </>
  );
}

export default forwardRef(BenifitPlanCoverage);
