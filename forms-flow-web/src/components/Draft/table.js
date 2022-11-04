import React from "react";
import { Link } from "react-router-dom";
import startCase from "lodash/startCase";
import {
  textFilter,
  customFilter,
  FILTER_TYPES,
} from "react-bootstrap-table2-filter";
import { getLocalDateTime } from "../../apiManager/services/formatterService";
import { getEmployeeNameFromSubmission } from "../../helper/helper";
import { Translation } from "react-i18next";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import { setSelectedDraftForDelete } from "../../actions/draftActions";
import { useDispatch } from "react-redux";

let statusFilter, idFilter, nameFilter, modifiedDateFilter;

export const defaultSortedBy = [
  {
    dataField: "id",
    order: "desc", // or desc
  },
];

/* commented below code, for more detail visit below link
https://github.com/bcgov/digital-journeys/issues/598 */
// const linkDraftDetail = (cell, row, redirectUrl) => {
//   return (
//     <Link
//       className="custom_primary_color"
//       to={`${redirectUrl}draft/${row.id}`}
//       title={cell}
//     >
//       {cell}
//     </Link>
//   );
// };


// const linkDraft = (cell, row, redirectUrl) => {
// eslint-disable-next-line
const LinkDraft = React.memo(({cell, row, redirectUrl}) => {
  const dispatch = useDispatch();
  const url = `${redirectUrl}form/${row.formId}/draft/${row.id}/edit`;
  const buttonText = <Translation>{(t) => t("Edit")}</Translation>;
  const deleteButtonText = <Translation>{(t) => t("Delete")}</Translation>;
  const icon = "fa fa-edit";
  const deleteIcon = "fa fa-trash";

  const handleDeleteDraft = (draft) => {
    dispatch(
      setSelectedDraftForDelete({
        modalOpen: true,
        draftId: draft.id,
        draftName: draft.DraftName,
      })
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Link to={url} style={{ textDecoration: "none" }}>
        <div>
          <span style={{ color: "blue", cursor: "pointer" }}>
            <span>
              <i className={icon} />
              &nbsp;
            </span>
            {buttonText}
          </span>
        </div>
      </Link>
      <div
        style={{ textDecoration: "none", marginLeft: "16px" }}
        onClick={() => handleDeleteDraft(row)}
      >
        <span style={{ color: "red", cursor: "pointer" }}>
          <span>
            <i className={deleteIcon} />
            &nbsp;
          </span>
          {deleteButtonText}
        </span>
      </div>
    </div>
  );
});

function timeFormatter(cell) {
  const localdate = getLocalDateTime(cell);
  return <label title={cell}>{localdate}</label>;
}

const nameFormatter = (cell, row) => {
  const employee = getEmployeeNameFromSubmission(cell, row);
  const name = employee !== '' ? `${cell} for ${employee}` : cell;
  return (
    <label className="text-truncate w-100" title={name}>
      {startCase(name)}
    </label>
  );
};
const customStyle = { border: "1px solid #ced4da", fontStyle: "normal" };

export const columns = (lastModified, callback, t, redirectUrl) => {
  return [
    /* commented below code, for more detail visit below link
    https://github.com/bcgov/digital-journeys/issues/598 */
    // {
    //   dataField: "id",
    //   text: <Translation>{(t) => t("Draft Id")}</Translation>,
    //   formatter: (cell, row) => linkDraftDetail(cell, row, redirectUrl),
    //   headerClasses: "classApplicationId",
    //   sort: true,
    //   filter: textFilter({
    //     delay: 800,
    //     placeholder: `\uf002 ${t("Draft Id")}`, // custom the input placeholder
    //     caseSensitive: false, // default is false, and true will only work when comparator is LIKE
    //     className: "icon-search",
    //     style: customStyle,
    //     getFilter: (filter) => {
    //       idFilter = filter;
    //     },
    //   }),
    // },
    {
      dataField: "DraftName",
      text: <Translation>{(t) => t("Draft Name")}</Translation>,
      sort: true,
      headerClasses: "classApplicationName",
      formatter: (cell, row) => nameFormatter(cell, row),
      filter: textFilter({
        delay: 800,
        placeholder: `\uf002 ${t("Draft Name")}`, // custom the input placeholder
        caseSensitive: false, // default is false, and true will only work when comparator is LIKE
        className: "icon-search",
        style: customStyle,
        getFilter: (filter) => {
          nameFilter = filter;
        },
      }),
      headerStyle: () => {
        return { width: "40%" };
      },
    },
    {
      dataField: "formUrl",
      text: <Translation>{(t) => t("Action")}</Translation>,
      // formatter: (cell, row) => linkDraft(cell, row, redirectUrl),
      formatter: (cell, row) => {
      return <LinkDraft cell={cell} row={row} redirectUrl={redirectUrl} />;
    },
      headerStyle: () => {
        return { width: "20%" };
      },
    },

    {
      dataField: "modified",
      text: <Translation>{(t) => t("Last Modified")}</Translation>,
      formatter: timeFormatter,
      sort: true,
      filter: customFilter({
        type: FILTER_TYPES.DATE,
      }),
      // eslint-disable-next-line no-unused-vars
      filterRenderer: (onFilter, column) => {
        return (
          <DateRangePicker
            onChange={(selectedRange) => {
              callback(selectedRange);
              onFilter(selectedRange);
            }}
            value={lastModified}
            maxDate={new Date()}
            dayPlaceholder="dd"
            monthPlaceholder="mm"
            yearPlaceholder="yyyy"
            calendarAriaLabel={t("Select the date")}
            dayAriaLabel="Select the day"
            clearAriaLabel="Click to clear"
          />
        );
      },
    },
  ];
};

const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    <Translation>{(t) => t("Showing")}</Translation> {from}{" "}
    <Translation>{(t) => t("to")}</Translation> {to}{" "}
    <Translation>{(t) => t("of")}</Translation> {size}{" "}
    <Translation>{(t) => t("Results")}</Translation>
  </span>
);
const customDropUp = ({ options, currSizePerPage, onSizePerPageChange }) => {
  return (
    <DropdownButton
      drop="up"
      variant="secondary"
      title={currSizePerPage}
      style={{ display: "inline" }}
    >
      {options.map((option) => (
        <Dropdown.Item
          key={option.text}
          type="button"
          onClick={() => onSizePerPageChange(option.page)}
        >
          {option.text}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
const getpageList = (count) => {
  const list = [
    {
      text: "5",
      value: 5,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    },
    {
      text: "All",
      value: count,
    },
  ];
  return list;
};

export const getoptions = (count, page, countPerPage) => {
  return {
    expandRowBgColor: "rgb(173,216,230)",
    pageStartIndex: 1,
    alwaysShowAllBtns: true, // Always show next and previous button
    withFirstAndLast: true, // Hide the going to First and Last page button
    hideSizePerPage: false, // Hide the sizePerPage dropdown always
    // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    paginationSize: 7, // the pagination bar size.
    prePageText: "<",
    nextPageText: ">",
    showTotal: true,
    Total: count,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPage: countPerPage,
    page: page,
    totalSize: count,
    sizePerPageList: getpageList(count),
    sizePerPageRenderer: customDropUp,
  };
};
export const clearFilter = () => {
  statusFilter("");
  idFilter("");
  nameFilter("");
  modifiedDateFilter("");
};