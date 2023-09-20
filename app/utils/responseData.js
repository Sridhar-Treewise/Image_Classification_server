import _ from "lodash";

export const formatTableData = (data) => {
    const { predictionInfo, image } = data;
    const formattedTableData = [];
    _.forEach(predictionInfo, (item, idx) => {
        formattedTableData.push({ ringNo: idx + 1, ...item });
    });
    return { image, predictionInfo: formattedTableData };
};