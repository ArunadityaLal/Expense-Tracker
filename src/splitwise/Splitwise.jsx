import React from "react";

const Splitwise = ({ memberNames, paidBy, amount }) => {
  if (!memberNames || memberNames.length === 0) {
    return <div>No members available.</div>;
  }

  if (!paidBy || !amount || paidBy.length !== amount.length) {
    return <div>Error: Invalid payment data.</div>;
  }

  const settlementLogs = settleExpenses(memberNames, paidBy, amount);

  return (
    <div>
      <h2>Expense Settlement</h2>
      <p>Members: {memberNames.join(", ")}</p>
      <ul>
        {settlementLogs.map((log, index) => ( 
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

function settleExpenses(memberNames, paidByArray, amountArray) {
  const logs = [];
  const n = memberNames.length;

  let balances = new Array(n).fill(0); 
  let members = memberNames; 
  let indices = Array.from({ length: n }, (_, i) => i); 

  for (let i = 0; i < paidByArray.length; i++) {
    const paidByPerson = paidByArray[i];
    const amt = amountArray[i];
    const index = members.indexOf(paidByPerson);

    if (index === -1) {
      logs.push(`Error: Invalid payer - ${paidByPerson}`);
      continue;
    }

    const share = amt / n;

    for (let j = 0; j < n; j++) {
      if (j !== index) {
        balances[j] = balances[j] - share;  
      } else {
        balances[j] = balances[j] - share + amt;  
      }
    }
  }

  let debtors = [];  
  let creditors = [];  
  
  for (let i = 0; i < n; i++) {
    if (balances[i] < 0) debtors.push([i, balances[i]]);
    else if (balances[i] > 0) creditors.push([i, balances[i]]);
  }

  while (debtors.length > 0 && creditors.length > 0) {
    let debtor = debtors.pop();  
    let creditor = creditors.pop();  

    let amountToPay = Math.min(Math.abs(debtor[1]), creditor[1]);

    logs.push(`${members[debtor[0]]} will pay €${amountToPay.toFixed(2)} to ${members[creditor[0]]}`);

    
    balances[debtor[0]] += amountToPay;
    balances[creditor[0]] -= amountToPay;

    
    if (balances[debtor[0]] == 0) {
      debtor[1] = 0;
    } else {
      debtors.push(debtor); 
    }


    if (balances[creditor[0]] == 0) {
      creditor[1] = 0;
    } else {
      creditors.push(creditor); 
    }
  }

  return logs;
}

export default Splitwise;


