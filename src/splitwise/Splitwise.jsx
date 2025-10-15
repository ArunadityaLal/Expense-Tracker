import React from "react";

const Splitwise = ({ memberNames, paidBy, amount }) => {
  if (!memberNames || memberNames.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-xl">
        <p className="text-gray-600">No members available.</p>
      </div>
    );
  }

  if (!paidBy || !amount || paidBy.length !== amount.length) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-xl">
        <p className="text-red-600">Error: Invalid payment data.</p>
      </div>
    );
  }

  const settlementLogs = settleExpenses(memberNames, paidBy, amount);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Group Members:</h3>
        <p className="text-gray-600">{memberNames.join(", ")}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 text-lg">Settlement Plan:</h3>
        {settlementLogs.length > 0 ? (
          <ul className="space-y-2">
            {settlementLogs.map((log, index) => (
              <li 
                key={index}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100"
              >
                <span className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">
                  {index + 1}
                </span>
                <span className="text-gray-700">{log}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <p className="text-blue-600 font-medium">✅ All settled up! No payments needed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function settleExpenses(memberNames, paidByArray, amountArray) {
  const logs = [];
  const n = memberNames.length;

  let balances = new Array(n).fill(0); 
  const members = [...memberNames]; 

  // Calculate balances
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

  // Separate debtors and creditors
  let debtors = [];  
  let creditors = [];  
  
  for (let i = 0; i < n; i++) {
    if (balances[i] < -0.01) { // Use small threshold for floating point comparison
      debtors.push([i, balances[i]]);
    } else if (balances[i] > 0.01) {
      creditors.push([i, balances[i]]);
    }
  }

  // Sort for greedy approach
  debtors.sort((a, b) => a[1] - b[1]); // Most negative first
  creditors.sort((a, b) => b[1] - a[1]); // Most positive first

  // Settle debts
  let debtorIdx = 0;
  let creditorIdx = 0;

  while (debtorIdx < debtors.length && creditorIdx < creditors.length) {
    const debtor = debtors[debtorIdx];
    const creditor = creditors[creditorIdx];

    const amountToPay = Math.min(Math.abs(debtor[1]), creditor[1]);

    if (amountToPay > 0.01) { // Only log meaningful transactions
      logs.push(
        `${members[debtor[0]]} will pay €${amountToPay.toFixed(2)} to ${members[creditor[0]]}`
      );
    }

    // Update balances
    debtor[1] += amountToPay;
    creditor[1] -= amountToPay;

    // Move to next debtor/creditor if settled
    if (Math.abs(debtor[1]) < 0.01) {
      debtorIdx++;
    }
    if (Math.abs(creditor[1]) < 0.01) {
      creditorIdx++;
    }
  }

  return logs;
}

export default Splitwise;