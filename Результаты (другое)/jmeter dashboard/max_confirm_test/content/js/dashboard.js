/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": NaN, "KoPercent": NaN};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5557342199934591, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "open_account"], "isController": true}, {"data": [0.0, 500, 1500, "5_Просмотр заказов"], "isController": true}, {"data": [0.0, 500, 1500, "6_Выбор без покупки"], "isController": true}, {"data": [1.0, 500, 1500, "open_order_list"], "isController": true}, {"data": [0.45605381165919284, 500, 1500, "open_payment_page"], "isController": true}, {"data": [0.0, 500, 1500, "2_Покупка с выбором из категории"], "isController": true}, {"data": [0.0, 500, 1500, "1_Регистрация"], "isController": true}, {"data": [0.0, 500, 1500, "open_homepage"], "isController": true}, {"data": [0.865962441314554, 500, 1500, "login"], "isController": true}, {"data": [0.4982078853046595, 500, 1500, "submit_payment"], "isController": true}, {"data": [0.826625386996904, 500, 1500, "add_to_cart"], "isController": true}, {"data": [1.0, 500, 1500, "open_register_page"], "isController": true}, {"data": [0.0, 500, 1500, "3_Быстрая покупка"], "isController": true}, {"data": [0.47368421052631576, 500, 1500, "open_item_page"], "isController": true}, {"data": [0.9984671980380135, 500, 1500, "logout"], "isController": true}, {"data": [0.5, 500, 1500, "submit_register_data"], "isController": true}, {"data": [0.8369175627240143, 500, 1500, "open_cart"], "isController": true}, {"data": [0.9977598566308243, 500, 1500, "delete_order"], "isController": true}, {"data": [0.4986798679867987, 500, 1500, "open_category_page"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 0, 0, NaN, NaN, 9223372036854775807, -9223372036854775808, NaN, NaN, NaN, NaN, 0.0, 0.0, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["open_account", 120, 0, 0.0, 698.4166666666667, 659, 1134, 694.0, 710.0, 721.95, 1050.2099999999969, 0.0338337151844022, 0.21308136807614167, 0.12819806144089899], "isController": true}, {"data": ["5_Просмотр заказов", 515, 0, 0.0, 4550.178640776696, 4216, 7407, 4506.0, 4690.0, 4815.4, 5852.079999999988, 0.14306580860517226, 22.39945794205529, 1.7273508985157824], "isController": true}, {"data": ["6_Выбор без покупки", 500, 0, 0.0, 5154.633999999993, 4746, 10623, 5070.0, 5421.8, 5559.75, 5940.42, 0.1389352006224297, 22.86955135218684, 1.5396489585070023], "isController": true}, {"data": ["open_order_list", 515, 0, 0.0, 306.4601941747572, 294, 380, 306.0, 312.0, 314.0, 325.84, 0.14322910148351975, 0.33540938831648237, 0.1480942086112395], "isController": true}, {"data": ["open_payment_page", 1115, 0, 0.0, 1365.909417040356, 1209, 4099, 1339.0, 1484.8, 1558.0, 1736.8799999999994, 0.3101884526993211, 3.95129247347541, 1.9380597671423632], "isController": true}, {"data": ["2_Покупка с выбором из категории", 1000, 0, 0.0, 8947.203000000012, 8151, 16397, 8796.0, 9506.9, 9822.599999999999, 11405.580000000004, 0.2773545039875257, 52.55177362441527, 6.91734213033637], "isController": true}, {"data": ["1_Регистрация", 120, 0, 0.0, 4413.499999999998, 4244, 5092, 4398.5, 4510.3, 4550.4, 5047.479999999999, 0.03379874201082236, 5.528679559460859, 0.5162229736809196], "isController": true}, {"data": ["open_homepage", 2251, 0, 0.0, 2785.191026210575, 2647, 3996, 2775.0, 2830.8, 2851.4, 3210.840000000001, 0.6248644993408526, 91.5191696738213, 4.376492372336519], "isController": true}, {"data": ["login", 2130, 0, 0.0, 471.3483568075122, 357, 5047, 432.0, 582.0, 656.4499999999998, 817.1800000000012, 0.5917809132596432, 1.2508024552656694, 0.9608465753284315], "isController": true}, {"data": ["submit_payment", 1116, 0, 0.0, 754.9740143369174, 658, 7275, 742.0, 789.0, 810.0, 896.0899999999983, 0.3102083566128583, 0.7491357107183381, 1.0960671379415396], "isController": true}, {"data": ["add_to_cart", 1615, 0, 0.0, 517.4613003095984, 407, 2995, 472.0, 636.2000000000003, 703.0, 901.0399999999995, 0.448748976768974, 0.35698006066238686, 0.31268856704657044], "isController": true}, {"data": ["open_register_page", 120, 0, 0.0, 299.5416666666666, 288, 315, 299.0, 306.0, 307.95, 315.0, 0.033838304227221956, 0.22890423181832664, 0.04821297447999691], "isController": true}, {"data": ["3_Быстрая покупка", 116, 0, 0.0, 8211.310344827585, 7647, 11452, 8102.0, 8914.9, 9075.75, 11094.829999999996, 0.03246724167271229, 6.020254085642006, 0.7670899705751628], "isController": true}, {"data": ["open_item_page", 1615, 0, 0.0, 1365.2569659442706, 1247, 4648, 1337.0, 1444.0, 1515.3999999999996, 1748.7199999999993, 0.4486608376872881, 6.7393510028958765, 0.7890137728112088], "isController": true}, {"data": ["logout", 1631, 0, 0.0, 227.77314530962593, 180, 1837, 234.0, 257.0, 265.0, 306.3600000000001, 0.45336195267523854, 0.5087039879139151, 0.4980294560010974], "isController": true}, {"data": ["submit_register_data", 120, 0, 0.0, 635.2333333333331, 599, 1338, 626.0, 659.8, 677.9, 1205.489999999995, 0.03383467868474453, 0.10944037185933118, 0.10338741172320864], "isController": true}, {"data": ["open_cart", 1116, 0, 0.0, 513.0878136200715, 421, 3793, 463.0, 611.5000000000003, 685.1499999999999, 888.3099999999959, 0.3101975786243849, 0.8049172557166273, 0.29744097247218854], "isController": true}, {"data": ["delete_order", 1116, 0, 0.0, 212.59408602150543, 184, 2226, 207.0, 229.0, 237.14999999999986, 270.0, 0.31021465130455544, 0.1871903434605723, 0.2186929900661819], "isController": true}, {"data": ["open_category_page", 1515, 0, 0.0, 744.976237623762, 690, 2436, 735.0, 771.0, 789.2, 884.8799999999994, 0.4210796649373217, 1.893547775361781, 0.5530782708405251], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 0, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
