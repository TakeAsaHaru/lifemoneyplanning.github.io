'use strict'

{
    //共通変数/定数
    const dateSepaStr = '-';
    const offsetColumn = 1;
    const termOffset = 1;

    let itemNum = 0;

    //テーブル作成ウィンドウ
    const createTable = document.getElementById('createTable');

    //テーブル作成ウインドウの処理
    createTable.addEventListener('click', ()=>{
        simTerm();
        createTable.setAttribute('disabled', true);

        const itemDel = document.getElementById('itemDel');
        itemDel.addEventListener('click', ()=>{
            runItemDel(itemNum);
        });
    });

    // ===============================================
    // 機能：選択した項目を削除
    // ===============================================
    function runItemDel(itemNum) {
        let idItemName;
        let idCheckName;
        for (let i = 1; i <= itemNum; i++) {
            idItemName = 'item' + i;
            idCheckName = 'check' + i;
            const idItem = document.getElementById(idItemName);
            const idCheck = document.getElementById(idCheckName);
            if (idCheck !== null && idCheck.checked) {
                idItem.remove();
            }
        }
        delTotalRow();
        getColumnTotal();
    }

    // ===============================================
    // 機能：シミュレーション開始/終了時期から結果テーブルのHeadを作成
    // ===============================================
    function simTerm(){
        const simStart = document.getElementById('simStart');
        const simEnd = document.getElementById('simEnd');
        const dateArray1 = simStart.value.split(dateSepaStr);
        const dateArray2 = simEnd.value.split(dateSepaStr);
        const date2 = parseInt(dateArray2[1]) + (parseInt(dateArray2[0]) - parseInt(dateArray1[0])) * 12; 
        const date1 = parseInt(dateArray1[1]);

        const resultTableHead = document.getElementById('resultTable-thead');
        let targetDate = [parseInt(dateArray1[0]), parseInt(dateArray1[1])];
        for (let i = 0; i <= date2 - date1 + 1; i++){
            const th = document.createElement('th');
            th.setAttribute('scope','col');
            th.classList.add('tableWidth');
            if (i === 0){
                th.textContent = '項目/年月日';
                resultTableHead.appendChild(th);
                continue;
            }

            if (i > 1){
                if (targetDate[1] > 11) {
                    targetDate[0] += 1;
                    targetDate[1] = 1;
                }else {
                    targetDate[1] += 1;
                }
            }
            
            if (targetDate[1] < 10) {
                th.textContent = `${targetDate[0]}${dateSepaStr}0${targetDate[1]}`;
            }else {
                th.textContent = `${targetDate[0]}${dateSepaStr}${targetDate[1]}`;
            }

            resultTableHead.appendChild(th);    
        }

        //削除ボタン作成
        const thDelBtn = document.createElement('th');
        thDelBtn.setAttribute('scope', 'col');
        thDelBtn.classList.add('tableWidh');

        const btnDel = document.createElement('button');
        btnDel.setAttribute('id', 'itemDel');
        btnDel.classList.add('bg-secondary');
        btnDel.classList.add('btn');
        btnDel.classList.add('btn-secondary');
        btnDel.textContent = '項目削除';

        thDelBtn.appendChild(btnDel);
        resultTableHead.appendChild(thDelBtn);

        simStart.setAttribute('disabled', true);
        simEnd.setAttribute('disabled', true);
    }

    //モーダルウインドウの処理
    const income = document.getElementById('income');
    const extend = document.getElementById('extend');
    const addItem = document.getElementById('addItem');

    //収入ボタン押下時の処理
    income.addEventListener('click', ()=>{
        if (income.classList.contains('btn-secondary') === true){
            income.classList.remove('btn-secondary');
            income.classList.add('btn-primary');
            extend.classList.remove('btn-primary');
            extend.classList.add('btn-secondary');
        }else {
            income.classList.remove('btn-primary');
            income.classList.add('btn-secondary');
            extend.classList.remove('btn-secondary');
            extend.classList.add('btn-primary');
        } 
    });

    //支出ボタン押下時の処理
    extend.addEventListener('click', ()=>{
        if (extend.classList.contains('btn-secondary') === true){
            extend.classList.remove('btn-secondary');
            extend.classList.add('btn-primary');
            income.classList.remove('btn-primary');
            income.classList.add('btn-secondary');
        }else {
            extend.classList.remove('btn-primary');
            extend.classList.add('btn-secondary');
            income.classList.remove('btn-secondary');
            income.classList.add('btn-primary');
        } 
    });

    addItem.addEventListener('click', ()=>{
        //モーダルウィンドウの設定項目
        const itemName = document.getElementById('itemName');
        const cost = document.getElementById('cost');
        const startTime = document.getElementById('startTime');
        const endTime = document.getElementById('endTime');
        const resultTable = document.getElementById('resultTable-thead');
        const child = resultTable.children;
        const startOffset = getDateDif(child.item(1).textContent, startTime.value) + offsetColumn;
        const term = getDateDif(startTime.value, endTime.value);
        const restTerm = getDateDif(endTime.value, child.item(child.length - 2).textContent) - termOffset;

        itemNum++;
        
        createResultTable(checkInEx(), startOffset, term, restTerm, itemName, cost, itemNum);
        itemName.value = '';
        cost.value = '';

        delTotalRow();
        getColumnTotal();
    });

    // ===============================================
    // 機能：収入/支出どちらを選択しているか判定
    // 収入→0
    // 支出→1
    // ===============================================
    function checkInEx() {
        const income = document.getElementById('income');
        if (income.classList.contains('btn-primary') === true){
            return 0
        }else{
            return 1
        }
    }

    // ===============================================
    // 機能：モーダルウインドウの入力内容から結果テーブルのbodyを作成
    // ===============================================
    function createResultTable(condition, startOffset, term, restTerm, itemName, cost, itemNum) {
        const resultTableBody = document.getElementById('resultTable-tbody');
        const tr = document.createElement('tr');
        tr.setAttribute('id', 'item' + itemNum)
        if (condition === 0){
            tr.classList.add('bg-info');
        }else {
            tr.classList.add('bg-warning');
        }
        resultTableBody.appendChild(tr);
        
        let totalCost = 0;
        const totalTerm = startOffset + term + restTerm - 2;

        const formatter = new Intl.NumberFormat('ja', {
            style: 'currency',
            currency: 'JPY'  
        });

        for (let i = 0; i <= totalTerm; i++){
            const td = document.createElement('td');
            td.setAttribute('scope','col');
            td.classList.add('tableWidth');
            if (i === 0){
                td.textContent = itemName.value;
                tr.appendChild(td);
                continue;
            }else if (i >= startOffset - 1 && i <= totalTerm - restTerm){
                if (condition === 0){
                    totalCost += parseInt(cost.value);
                }else{
                    totalCost -= parseInt(cost.value);
                }
            }
            td.textContent = formatter.format(totalCost);
            tr.appendChild(td);

            if (i === totalTerm) {
                const tdCheck = document.createElement('td');
                tdCheck.setAttribute('scope', 'col');
                tdCheck.classList.add('tableWidth');
                tdCheck.style.textAlign = 'center';

                const input = document.createElement('input');
                input.classList.add('form-check-input');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('id', 'check' + itemNum);
                tdCheck.appendChild(input);
                tr.appendChild(tdCheck);
            }
        }
    }

    // ===============================================
    // 機能：合計値行を削除
    // ===============================================   
    function delTotalRow (){
        const totalCost = document.getElementById('totalCost');

        if (totalCost !== null) {
            totalCost.remove();
        }
    }

     // ===============================================
    // 機能：各カラムの合計値を取得
    // ===============================================   
    function getColumnTotal (){
        const resultTableHead = document.getElementById('resultTable-thead');
        const resultTableBody = document.getElementById('resultTable-tbody');
        const child = resultTableHead.children;
        const tr = document.createElement('tr');
        tr.setAttribute('id', 'totalCost');
        for (let i = 0; i < child.length - 1; i++) {
            const td = document.createElement('td');
            let totalCost = 0;
            if (i === 0){
                td.textContent = '合計';
                tr.appendChild(td);
            }else {
                for (let j = 1; j <= itemNum; j++){
                    const idItemName = document.getElementById('item' + j);
                    if (idItemName !== null){
                        const childIdItem = idItemName.children;
                        let str = childIdItem.item(i).textContent
                        if (str.substr(0, 1) === '-') {
                            str = str.substr(0, 1) + str.substr(2);
                            totalCost += parseInt(toNumber(str));
                        }else {
                            totalCost += parseInt(toNumber(str.substr(1)));
                        }
                    }
                    
                    if (j === itemNum){
                        const formatter = new Intl.NumberFormat('ja', {
                            style: 'currency',
                            currency: 'JPY'  
                        });
                        td.textContent = formatter.format(totalCost);
                        tr.appendChild(td);
                    }
                }
            }
            if (i === child.length - 2){
                resultTableBody.appendChild(tr);
            }
        }
    }

    // ===============================================
    // 機能：カンマが含まれる数値文字列を数値に変換
    // ===============================================
    function toNumber (str){
        return Number(new String(str).replace(/,/g, ''));
    }

    // ===============================================
    // 機能：2つの日時の差分を習得(date2 - date1)
    // ※引数date1とdate2は'yyyy/mm/ddの形式の文字列'
    // ===============================================
    function getDateDif(date1, date2) {
        const startArray = date1.split(dateSepaStr);
        const endArray = date2.split(dateSepaStr);
        return termOffset + parseInt(endArray[1]) + (parseInt(endArray[0]) - parseInt(startArray[0])) * 12 - parseInt(startArray[1]);
    }
}