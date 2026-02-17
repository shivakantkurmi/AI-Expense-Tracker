import React, { useEffect, useRef, useState } from "react";

const FinanceOverview = ({ totalBalance = 0, totalIncome = 0, totalExpense = 0 }) => {
  const canvasRef = useRef(null);
  const [hoverLabel, setHoverLabel] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;
    const lineWidth = 30;

    const total = totalBalance + totalIncome + totalExpense;
    if (total === 0) return;

    const segments = [
      { label: "Balance", value: totalBalance, color: "#8b5cf6" },
      { label: "Expenses", value: totalExpense, color: "#ef4444" },
      { label: "Income", value: totalIncome, color: "#f97316" },
    ];

    const arcs = [];
    let startAngle = -0.5 * Math.PI;
    ctx.clearRect(0, 0, width, height);

    segments.forEach(({ value, color, label }) => {
      if (value <= 0) return;
      const angle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.stroke();

      arcs.push({ startAngle, endAngle, label, color });
      startAngle = endAngle;
    });

    ctx.fillStyle = "#111827";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Total Balance", centerX, centerY - 10);
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(`₹${totalBalance}`, centerX, centerY + 20);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      let adjustedAngle = angle >= -0.5 * Math.PI ? angle : 2 * Math.PI + angle;

      let found = false;
      for (const arc of arcs) {
        if (
          distance >= radius - lineWidth / 2 &&
          distance <= radius + lineWidth / 2 &&
          adjustedAngle >= arc.startAngle &&
          adjustedAngle <= arc.endAngle
        ) {
          setHoverLabel(arc.label);
          found = true;
          break;
        }
      }
      if (!found) setHoverLabel(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [totalBalance, totalIncome, totalExpense]);

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-300">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
        Financial Overview
      </h3>

      <div className="flex justify-center relative">
        <canvas
          ref={canvasRef}
          width="280"
          height="280"
          className="w-56 h-56 sm:w-[280px] sm:h-[280px]"
        />
        {hoverLabel && (
          <div className="absolute text-xs sm:text-sm bg-white border px-2 py-1 rounded shadow text-gray-800 top-[40%] left-1/2 -translate-x-1/2">
            {hoverLabel}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-5 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-full" /> Balance
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" /> Expense
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-500 rounded-full" /> Income
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
