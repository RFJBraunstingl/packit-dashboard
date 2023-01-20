import React, { useState, useEffect } from "react";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    SortByDirection,
    cellWidth,
} from "@patternfly/react-table";

import { Button } from "@patternfly/react-core";

import ConnectionError from "../error";
import TriggerLink from "../trigger_link";
import Preloader from "../preloader";
import ForgeIcon from "../forge_icon";
import { StatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";

const SRPMBuildstable = () => {
    // Headings
    const columns = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(55)] },
        { title: "Results", transforms: [cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
    ];

    // Local State
    const [rows, setRows] = useState([]);
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [sortBy, setSortBy] = useState({});
    const [page, setPage] = useState(1);

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(
            `${process.env.REACT_APP_API_URL}/srpm-builds?page=${page}&per_page=20`
        )
            .then((response) => response.json())
            .then((data) => {
                jsonToRow(data);
                setLoaded(true);
                setPage(page + 1); // set next page
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }

    // Convert fetched json into row format that the table can read
    function jsonToRow(res) {
        let rowsList = [];

        res.forEach((srpm_builds) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={srpm_builds.project_url} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={srpm_builds} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <StatusLabel
                                status={srpm_builds.status}
                                link={`/results/srpm-builds/${srpm_builds.srpm_build_id}`}
                            />
                        ),
                    },
                    {
                        title: (
                            <Timestamp
                                stamp={srpm_builds.build_submitted_time}
                            />
                        ),
                    },
                ],
            };
            rowsList.push(singleRow);
        });
        setRows(rows.concat(rowsList));
    }

    function onSort(_event, index, direction) {
        const sortedRows = rows.sort((a, b) =>
            a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0
        );
        setSortBy({
            index,
            direction,
        });
        setRows(
            direction === SortByDirection.asc
                ? sortedRows
                : sortedRows.reverse()
        );
    }

    // Executes fetchData on first render of component
    // look at detailed comment in ./copr_builds_table.js
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If backend API is down
    if (hasError) {
        return <ConnectionError />;
    }

    // Show preloader if waiting for API data
    if (!loaded) {
        return <Preloader />;
    }

    return (
        <div>
            <Table
                aria-label="Sortable Table"
                variant={TableVariant.compact}
                sortBy={sortBy}
                onSort={onSort}
                cells={columns}
                rows={rows}
            >
                <TableHeader />
                <TableBody />
            </Table>
            <center>
                <br />
                <Button variant="control" onClick={fetchData}>
                    Load More
                </Button>
            </center>
        </div>
    );
};

export default SRPMBuildstable;
