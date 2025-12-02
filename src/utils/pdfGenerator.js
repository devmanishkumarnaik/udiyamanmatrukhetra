// // PDF Generator for Student Mark Card
// export const generateMarkCardPDF = (result) => {
//   // Detect if mobile device
//   const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
//   // For mobile devices, create a different experience
//   if (isMobile) {
//     generateMarkCardMobile(result);
//     return;
//   }
  
//   // Create a new window for printing (desktop)
//   const printWindow = window.open('', '_blank');
  
//   if (!printWindow) {
//     alert('Please allow pop-ups to download the mark card');
//     return;
//   }

//   // Calculate grade based on percentage
//   const getGrade = (percentage) => {
//     if (percentage >= 90) return 'A1';
//     if (percentage >= 80) return 'A2';
//     if (percentage >= 70) return 'B1';
//     if (percentage >= 60) return 'B2';
//     if (percentage >= 50) return 'C';
//     if (percentage >= 40) return 'D';
//     if (percentage >= 33) return 'E';
//     return 'F';
//   };

//   const grade = getGrade(result.percentage);

//   // Generate HTML for the mark card
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
//       <title>Mark Sheet - ${result.studentName}</title>
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           -webkit-print-color-adjust: exact;
//           print-color-adjust: exact;
//           color-adjust: exact;
//         }
        
//         @page {
//           size: A4 portrait;
//           margin: 15mm;
//         }
        
//         html {
//           width: 210mm;
//           height: 297mm;
//         }
        
//         body {
//           font-family: 'Arial', sans-serif;
//           padding: 10px;
//           background: #f5f5f5;
//           font-size: 12px;
//           width: 100%;
//           max-width: 210mm;
//           margin: 0 auto;
//         }
        
//         .mark-card {
//           max-width: 210mm;
//           margin: 0 auto;
//           background: white;
//           padding: 20px;
//           border: 2px solid #667eea;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//           position: relative;
//         }
        
//         .watermark {
//           position: fixed;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%) rotate(-45deg);
//           font-size: 60px;
//           font-weight: bold;
//           color: rgba(102, 126, 234, 0.08);
//           text-transform: uppercase;
//           pointer-events: none;
//           z-index: 0;
//           white-space: nowrap;
//         }
        
//         .header {
//           text-align: center;
//           margin-bottom: 15px;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #667eea;
//         }
        
//         .header h1 {
//           color: #667eea;
//           font-size: 20px;
//           margin-bottom: 5px;
//           text-transform: uppercase;
//           letter-spacing: 1.5px;
//         }
        
//         .header h2 {
//           color: #764ba2;
//           font-size: 14px;
//           margin-bottom: 3px;
//         }
        
//         .institute-header {
//           text-align: center;
//           margin-bottom: 10px;
//         }
        
//         .institute-header .the-mother {
//           font-size: 16px;
//           font-weight: bold;
//           color: #2c3e50;
//           text-decoration: underline;
//           text-underline-offset: 4px;
//           margin-bottom: 5px;
//         }
        
//         .institute-header .institute-name {
//           font-size: 11px;
//           font-weight: 600;
//           color: #2c3e50;
//           line-height: 1.4;
//           margin-bottom: 10px;
//         }
        
//         .student-info {
//           margin: 12px 0;
//           padding: 12px;
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
//           border-radius: 6px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .student-info table {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .student-info td {
//           padding: 5px;
//           font-size: 12px;
//         }
        
//         .student-info td:first-child {
//           font-weight: bold;
//           color: #2c3e50;
//           width: 120px;
//         }
        
//         .marks-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 12px 0;
//           font-size: 11px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .marks-table th {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 8px 6px;
//           text-align: center;
//           font-size: 11px;
//           border: 1px solid #ddd;
//         }
        
//         .marks-table td {
//           padding: 6px;
//           text-align: center;
//           border: 1px solid #ddd;
//           font-size: 11px;
//         }
        
//         .marks-table tbody tr:nth-child(even) {
//           background: #f8f9fa;
//         }
        
//         .marks-table tbody tr:hover {
//           background: #e9ecef;
//         }
        
//         .total-row {
//           background: #e9ecef !important;
//           font-weight: bold;
//           font-size: 12px;
//         }
        
//         .result-summary {
//           margin: 12px 0;
//           padding: 12px;
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
//           border-radius: 6px;
//           border: 2px solid #667eea;
//           position: relative;
//           z-index: 1;
//         }
        
//         .result-summary table {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .result-summary td {
//           padding: 6px;
//           font-size: 12px;
//         }
        
//         .result-summary td:first-child {
//           font-weight: bold;
//           color: #2c3e50;
//           width: 120px;
//         }
        
//         .grade-display {
//           font-size: 18px;
//           color: #667eea;
//           font-weight: bold;
//         }
        
//         .percentage-display {
//           font-size: 16px;
//           color: ${result.percentage >= 60 ? '#28a745' : '#dc3545'};
//           font-weight: bold;
//         }
        
//         .signature-section {
//           margin-top: 20px;
//           padding: 15px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-end;
//           position: relative;
//           z-index: 1;
//         }
        
//         .signature-box {
//           text-align: center;
//           flex: 1;
//           margin: 0 10px;
//         }
        
//         .signature-line {
//           border-top: 1px solid #000;
//           margin-top: 40px;
//           padding-top: 5px;
//         }
        
//         .signature-name {
//           font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
//           font-size: 14px;
//           color: #2c3e50;
//           font-weight: bold;
//           font-style: italic;
//           margin-bottom: 5px;
//         }
        
//         .signature-title {
//           font-size: 11px;
//           color: #6c757d;
//           font-weight: 600;
//         }
        
//         .footer {
//           margin-top: 15px;
//           padding-top: 10px;
//           border-top: 1px solid #ddd;
//           text-align: center;
//           color: #6c757d;
//           font-size: 9px;
//         }
        
//         .date-print {
//           text-align: right;
//           margin-top: 8px;
//           font-size: 10px;
//           color: #6c757d;
//         }
        
//         /* Mobile specific styles */
//         @media screen and (max-width: 768px) {
//           html {
//             width: 100%;
//           }
          
//           body {
//             padding: 10px;
//             font-size: 11px;
//             max-width: 100%;
//           }
          
//           .mark-card {
//             padding: 15px;
//             width: 100%;
//             max-width: 100%;
//           }
          
//           .marks-table {
//             font-size: 10px;
//             overflow-x: auto;
//           }
          
//           .marks-table th,
//           .marks-table td {
//             padding: 5px 4px;
//             font-size: 10px;
//           }
          
//           .student-info td {
//             font-size: 11px;
//             padding: 4px;
//           }
//         }
        
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//             color-adjust: exact !important;
//           }
          
//           html, body {
//             width: 210mm;
//             height: 297mm;
//             margin: 0;
//             padding: 0;
//             background: white;
//           }
          
//           body {
//             padding: 0;
//             background: white;
//           }
          
//           .mark-card {
//             border: 2px solid #667eea;
//             box-shadow: none;
//             page-break-inside: avoid;
//             page-break-after: avoid;
//             width: 100%;
//             max-width: 100%;
//           }
          
//           @page {
//             size: A4 portrait;
//             margin: 15mm;
//           }
          
//           /* Ensure colors print correctly */
//           .marks-table th {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
//             color: white !important;
//           }
          
//           .watermark {
//             display: block !important;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="mark-card">
//         <div class="watermark">Udiyaman Matrukhetra</div>
        
//         <div class="institute-header">
//           <div class="the-mother">THE MOTHER</div>
//           <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
//         </div>
        
//         <div class="header">
//           <h1>Mark Sheet</h1>
//           <h2>${result.testType || 'Examination Result'}</h2>
//         </div>
        
//         <div class="student-info">
//           <table>
//             <tr>
//               <td>Student Name:</td>
//               <td>${result.studentName}</td>
//             </tr>
//             <tr>
//               <td>Roll Number:</td>
//               <td>${result.rollNumber}</td>
//             </tr>
//             <tr>
//               <td>Class:</td>
//               <td>${result.class}</td>
//             </tr>
//           </table>
//         </div>
        
//         <table class="marks-table">
//           <thead>
//             <tr>
//               <th>Subject</th>
//               <th>Marks Obtained</th>
//               <th>Maximum Marks</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${result.subjects.map(subject => `
//               <tr>
//                 <td>${subject.name}</td>
//                 <td>${subject.marks}</td>
//                 <td>${subject.maxMarks}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td>TOTAL</td>
//               <td>${result.obtainedMarks}</td>
//               <td>${result.totalMarks}</td>
//             </tr>
//           </tbody>
//         </table>
        
//         <div class="result-summary">
//           <table>
//             <tr>
//               <td>Grade:</td>
//               <td class="grade-display">${grade}</td>
//             </tr>
//             <tr>
//               <td>Percentage:</td>
//               <td class="percentage-display">${result.percentage}%</td>
//             </tr>
//           </table>
//         </div>
        
//         <div class="signature-section">
//           <div class="signature-box">
//             <div class="signature-line">
//               <div class="signature-name">Ramesh Ch. Suhula</div>
//               <div class="signature-title">Principal</div>
//               <div style="font-size: 9px; color: #999; margin-top: 2px;">Udiyaman Matrukhetra</div>
//             </div>
//           </div>
//         </div>
        
//         <div class="footer">
//           <p>This is a computer-generated mark sheet.</p>
//           <p style="margin-top: 5px;">Downloaded on: ${new Date().toLocaleDateString('en-US', { 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })}</p>
//         </div>
//       </div>
      
//       <script>
//         // Detect mobile device
//         const isMobile = ${isMobile};
        
//         // Auto print when page loads
//         window.onload = function() {
//           // Wait for all content to load
//           setTimeout(function() {
//             try {
//               // Try to print
//               window.print();
              
//               // For mobile devices, give more time before closing
//               const closeDelay = isMobile ? 1000 : 100;
              
//               // Close window after printing or canceling
//               setTimeout(function() {
//                 window.close();
//               }, closeDelay);
//             } catch (error) {
//               console.error('Print error:', error);
//               // If print fails, keep window open for manual download
//               alert('Please use your browser menu to print or save as PDF');
//             }
//           }, isMobile ? 1000 : 500);
//         };
        
//         // Prevent accidental navigation away
//         window.onbeforeprint = function() {
//           document.body.style.background = 'white';
//         };
        
//         window.onafterprint = function() {
//           // Small delay before closing
//           setTimeout(function() {
//             window.close();
//           }, 100);
//         };
//       </script>
//     </body>
//     </html>
//   `;

//   printWindow.document.write(htmlContent);
//   printWindow.document.close();
// };

// // PDF Generator for Progress Card
// export const generateProgressCardPDF = (card) => {
//   // Detect if mobile device
//   const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
//   // For mobile devices, create a downloadable blob and trigger download
//   if (isMobile) {
//     generateProgressCardMobile(card);
//     return;
//   }
  
//   // Create a new window for printing (desktop)
//   const printWindow = window.open('', '_blank');
  
//   if (!printWindow) {
//     alert('Please allow pop-ups to download the progress card');
//     return;
//   }

//   // Calculate grade based on percentage
//   const getGrade = (percentage) => {
//     if (percentage >= 90) return 'A1';
//     if (percentage >= 80) return 'A2';
//     if (percentage >= 70) return 'B1';
//     if (percentage >= 60) return 'B2';
//     if (percentage >= 50) return 'C';
//     if (percentage >= 40) return 'D';
//     if (percentage >= 33) return 'E';
//     return 'F';
//   };

//   // Calculate test totals
//   const test1Total = card.subjects.reduce((sum, s) => sum + s.test1Marks, 0);
//   const test1FM = card.subjects.reduce((sum, s) => sum + s.test1FM, 0);
//   const test1Percentage = ((test1Total / test1FM) * 100).toFixed(2);
//   const test1Grade = getGrade(parseFloat(test1Percentage));

//   const test2Total = card.subjects.reduce((sum, s) => sum + s.test2Marks, 0);
//   const test2FM = card.subjects.reduce((sum, s) => sum + s.test2FM, 0);
//   const test2Percentage = ((test2Total / test2FM) * 100).toFixed(2);
//   const test2Grade = getGrade(parseFloat(test2Percentage));

//   const halfYearlyTotal = card.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0);
//   const halfYearlyFM = card.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0);
//   const halfYearlyPercentage = ((halfYearlyTotal / halfYearlyFM) * 100).toFixed(2);
//   const halfYearlyGrade = getGrade(parseFloat(halfYearlyPercentage));

//   const test3Total = card.subjects.reduce((sum, s) => sum + s.test3Marks, 0);
//   const test3FM = card.subjects.reduce((sum, s) => sum + s.test3FM, 0);
//   const test3Percentage = ((test3Total / test3FM) * 100).toFixed(2);
//   const test3Grade = getGrade(parseFloat(test3Percentage));

//   const annualTotal = card.subjects.reduce((sum, s) => sum + s.annualMarks, 0);
//   const annualFM = card.subjects.reduce((sum, s) => sum + s.annualFM, 0);
//   const annualPercentage = ((annualTotal / annualFM) * 100).toFixed(2);
//   const annualGrade = getGrade(parseFloat(annualPercentage));

//   // Generate HTML for the progress card
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
//       <title>Progress Card - ${card.studentName}</title>
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           -webkit-print-color-adjust: exact;
//           print-color-adjust: exact;
//           color-adjust: exact;
//         }
        
//         @page {
//           size: A4 portrait;
//           margin: 10mm;
//         }
        
//         html {
//           width: 210mm;
//           height: 297mm;
//         }
        
//         body {
//           font-family: 'Arial', sans-serif;
//           padding: 5px;
//           background: #f5f5f5;
//           font-size: 10px;
//           width: 100%;
//           max-width: 210mm;
//           margin: 0 auto;
//         }
        
//         .progress-card {
//           max-width: 210mm;
//           margin: 0 auto;
//           background: white;
//           padding: 12px;
//           border: 2px solid #667eea;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//           position: relative;
//         }
        
//         .watermark {
//           position: fixed;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%) rotate(-45deg);
//           font-size: 60px;
//           font-weight: bold;
//           color: rgba(102, 126, 234, 0.08);
//           text-transform: uppercase;
//           pointer-events: none;
//           z-index: 0;
//           white-space: nowrap;
//         }
        
//         .header {
//           text-align: center;
//           margin-bottom: 15px;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #667eea;
//         }
        
//         .header h1 {
//           color: #667eea;
//           font-size: 20px;
//           margin-bottom: 5px;
//           text-transform: uppercase;
//           letter-spacing: 1.5px;
//         }
        
//         .header h2 {
//           color: #764ba2;
//           font-size: 14px;
//           margin-bottom: 3px;
//         }
        
//         .institute-header {
//           text-align: center;
//           margin-bottom: 10px;
//         }
        
//         .institute-header .the-mother {
//           font-size: 16px;
//           font-weight: bold;
//           color: #2c3e50;
//           text-decoration: underline;
//           text-underline-offset: 4px;
//           margin-bottom: 5px;
//         }
        
//         .institute-header .institute-name {
//           font-size: 11px;
//           font-weight: 600;
//           color: #2c3e50;
//           line-height: 1.4;
//           margin-bottom: 10px;
//         }
        
//         .student-info {
//           margin: 6px 0;
//           padding: 8px;
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
//           border-radius: 6px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .student-info table {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .student-info td {
//           padding: 3px;
//           font-size: 9px;
//         }
        
//         .student-info td:first-child {
//           font-weight: bold;
//           color: #2c3e50;
//           width: 100px;
//         }
        
//         .marks-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 8px 0;
//           font-size: 8px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .marks-table th {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 5px 3px;
//           text-align: center;
//           font-size: 8px;
//           border: 1px solid #ddd;
//         }
        
//         .marks-table td {
//           padding: 4px 3px;
//           text-align: center;
//           border: 1px solid #ddd;
//           font-size: 8px;
//         }
        
//         .marks-table tbody tr:nth-child(even) {
//           background: #f8f9fa;
//         }
        
//         .total-row {
//           background: #e9ecef !important;
//           font-weight: bold;
//           font-size: 9px;
//         }
        
//         .result-summary {
//           margin: 8px 0;
//           padding: 8px;
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
//           border-radius: 6px;
//           border: 2px solid #667eea;
//           position: relative;
//           z-index: 1;
//         }
        
//         .result-summary table {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .result-summary td {
//           padding: 6px;
//           font-size: 12px;
//         }
        
//         .result-summary td:first-child {
//           font-weight: bold;
//           color: #2c3e50;
//           width: 120px;
//         }
        
//         .grade-display {
//           font-size: 18px;
//           color: #667eea;
//           font-weight: bold;
//         }
        
//         .percentage-display {
//           font-size: 16px;
//           color: ${card.percentage >= 60 ? '#28a745' : '#dc3545'};
//           font-weight: bold;
//         }
        
//         .remarks-section {
//           margin: 12px 0;
//           padding: 10px;
//           background: #f8f9fa;
//           border-radius: 6px;
//           border-left: 4px solid #667eea;
//           position: relative;
//           z-index: 1;
//         }
        
//         .remarks-section h3 {
//           font-size: 12px;
//           color: #2c3e50;
//           margin-bottom: 5px;
//         }
        
//         .remarks-section p {
//           font-size: 11px;
//           color: #495057;
//           line-height: 1.5;
//         }
        
//         .footer {
//           margin-top: 8px;
//           padding-top: 6px;
//           border-top: 1px solid #ddd;
//           text-align: center;
//           color: #6c757d;
//           font-size: 7px;
//         }
        
//         /* Mobile specific styles */
//         @media screen and (max-width: 768px) {
//           html {
//             width: 100%;
//           }
          
//           body {
//             padding: 10px;
//             font-size: 9px;
//             max-width: 100%;
//           }
          
//           .progress-card {
//             padding: 10px;
//             width: 100%;
//             max-width: 100%;
//           }
          
//           .marks-table {
//             font-size: 7px;
//             overflow-x: auto;
//           }
          
//           .marks-table th,
//           .marks-table td {
//             padding: 3px 2px;
//             font-size: 7px;
//           }
          
//           .student-info td {
//             font-size: 8px;
//             padding: 2px;
//           }
//         }
        
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//             color-adjust: exact !important;
//           }
          
//           html, body {
//             width: 210mm;
//             height: 297mm;
//             margin: 0;
//             padding: 0;
//             background: white;
//           }
          
//           body {
//             padding: 0;
//             background: white;
//           }
          
//           .progress-card {
//             border: 2px solid #667eea;
//             box-shadow: none;
//             page-break-inside: avoid;
//             page-break-after: avoid;
//             width: 100%;
//             max-width: 100%;
//           }
          
//           @page {
//             size: A4 portrait;
//             margin: 10mm;
//           }
          
//           /* Ensure colors print correctly */
//           .marks-table th {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
//             color: white !important;
//           }
          
//           .watermark {
//             display: block !important;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="progress-card">
//         <div class="watermark">Udiyaman Matrukhetra</div>
        
//         <div class="institute-header">
//           <div class="the-mother">THE MOTHER</div>
//           <div style="font-size: 10px; font-style: italic; color: #667eea; margin-bottom: 8px; font-weight: 600; letter-spacing: 0.5px;">DO NOT AIM AT SUCCESS OUR AIM PERFECTION</div>
//           <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
//         </div>
        
//         <div class="header">
//           <h1>Progress Card</h1>
//           <h2>${card.year || 'Academic Year'}</h2>
//         </div>
        
//         <div class="student-info">
//           <table>
//             <tr>
//               <td>Student Name:</td>
//               <td>${card.studentName}</td>
//               <td style="width: 30px;"></td>
//               <td>Class:</td>
//               <td>${card.class}</td>
//             </tr>
//             <tr>
//               <td>Father's Name:</td>
//               <td>${card.fatherName || 'N/A'}</td>
//               <td style="width: 30px;"></td>
//               <td>Roll Number:</td>
//               <td>${card.rollNumber}</td>
//             </tr>
//             <tr>
//               <td>Mother's Name:</td>
//               <td>${card.motherName || 'N/A'}</td>
//               <td style="width: 30px;"></td>
//               <td>Aadhaar No:</td>
//               <td>${card.aadhaarNumber.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}</td>
//             </tr>
//           </table>
//         </div>
        
//         <table class="marks-table">
//           <thead>
//             <tr>
//               <th>Subject Name</th>
//               <th>1st Unit Test</th>
//               <th>2nd Unit Test</th>
//               <th>Half Yearly</th>
//               <th>3rd Unit Test</th>
//               <th>Annual Exam</th>
//               <th>Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${card.subjects.map(subject => `
//               <tr>
//                 <td style="text-align: left; font-weight: 600;">${subject.name}</td>
//                 <td>${subject.test1Marks}/${subject.test1FM}</td>
//                 <td>${subject.test2Marks}/${subject.test2FM}</td>
//                 <td>${subject.halfYearlyMarks}/${subject.halfYearlyFM}</td>
//                 <td>${subject.test3Marks}/${subject.test3FM}</td>
//                 <td>${subject.annualMarks}/${subject.annualFM}</td>
//                 <td style="text-align: left; font-style: italic;">${subject.remarks || ''}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td style="text-align: left;">GRAND TOTAL</td>
//               <td>${test1Total}/${test1FM}</td>
//               <td>${test2Total}/${test2FM}</td>
//               <td>${halfYearlyTotal}/${halfYearlyFM}</td>
//               <td>${test3Total}/${test3FM}</td>
//               <td>${annualTotal}/${annualFM}</td>
//               <td style="text-align: left; font-style: italic;">${card.remarks || ''}</td>
//             </tr>
//           </tbody>
//         </table>
        
//         <!-- Attendance Table -->
//         <div style="margin: 10px 0;">
//           <h3 style="font-size: 10px; color: #2c3e50; margin-bottom: 6px; text-align: center; font-weight: 700;">Attendance Record</h3>
//           <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 1px solid #ddd;">
//             <thead>
//               <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
//                 <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Exam</th>
//                 <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Total Working Days</th>
//                 <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Days Present</th>
//                 <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Percentage</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr style="background: #fff3cd;">
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Half Yearly</td>
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${card.halfYearlyWorkingDays || 0}</td>
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.halfYearlyDaysPresent || 0}</td>
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 700; color: #667eea;">${card.halfYearlyWorkingDays > 0 ? ((card.halfYearlyDaysPresent / card.halfYearlyWorkingDays) * 100).toFixed(2) : 0}%</td>
//               </tr>
//               <tr style="background: #d1ecf1;">
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Annual</td>
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${card.annualWorkingDays || 0}</td>
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.annualDaysPresent || 0}</td>
//                 <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 700; color: #667eea;">${card.annualWorkingDays > 0 ? ((card.annualDaysPresent / card.annualWorkingDays) * 100).toFixed(2) : 0}%</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
        
//         <div class="result-summary">
//           <h3 style="font-size: 10px; color: #2c3e50; margin-bottom: 6px; text-align: center;">Test-wise Performance</h3>
//           <table style="width: 100%; table-layout: fixed;">
//             <tr>
//               <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">1st Unit Test</strong>
//                 <div style="margin-bottom: 4px;">
//                   <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${test1Grade}</span>
//                   <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${test1Percentage}%)</span>
//                 </div>
//                 <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">2nd Unit Test</strong>
//                 <div style="margin-bottom: 4px;">
//                   <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${test2Grade}</span>
//                   <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${test2Percentage}%)</span>
//                 </div>
//                 <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">Half Yearly</strong>
//                 <div style="margin-bottom: 4px;">
//                   <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${halfYearlyGrade}</span>
//                   <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${halfYearlyPercentage}%)</span>
//                 </div>
//                 <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">3rd Unit Test</strong>
//                 <div style="margin-bottom: 4px;">
//                   <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${test3Grade}</span>
//                   <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${test3Percentage}%)</span>
//                 </div>
//                 <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">Annual Exam</strong>
//                 <div style="margin-bottom: 4px;">
//                   <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${annualGrade}</span>
//                   <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${annualPercentage}%)</span>
//                 </div>
//                 <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">Principal Signature</strong>
//                 <div style="margin-top: 18px; margin-bottom: 6px; text-align: center;">
//                   <div style="font-family: 'Brush Script MT', 'Lucida Handwriting', cursive; font-size: 12px; color: #2c3e50; font-weight: bold; font-style: italic;">Ramesh Ch. Suhula</div>
//                 </div>
//                 <div style="margin-top: 10px; padding-top: 6px; border-top: 1px solid #000; text-align: center;">
//                   <span style="font-size: 7px; color: #6c757d; font-weight: 600;">Principal</span><br>
//                   <span style="font-size: 6px; color: #6c757d;">Udiyaman Matrukhetra</span>
//                 </div>
//               </td>
//             </tr>
//           </table>
//         </div>
        
//         <div style="margin: 8px 0; padding: 8px; border-radius: 6px; border: 2px solid ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'}; background: ${card.promotionStatus === 'Promoted' ? '#d4edda' : '#f8d7da'};">
//           <div style="display: flex; align-items: center; gap: 6px;">
//             <span style="font-size: 16px; font-weight: bold; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
//               ${card.promotionStatus === 'Promoted' ? '✓' : '✗'}
//             </span>
//             <span style="font-size: 11px; font-weight: 700; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
//               ${card.promotionStatus === 'Promoted' ? 'Promoted to Next Higher Class' : 'Not Promoted'}
//             </span>
//           </div>
//         </div>
        
//         <div style="margin: 10px 0; padding: 10px; border-radius: 6px; background: #f8f9fa; border: 1px solid #dee2e6;">
//           <h3 style="font-size: 11px; color: #2c3e50; margin-bottom: 6px; text-align: center; font-weight: 700;">Grading Scale</h3>
//           <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
//             <tr>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A1: 90-100%</td>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A2: 80-89%</td>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B1: 70-79%</td>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B2: 60-69%</td>
//             </tr>
//             <tr>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #fff3e0; font-weight: 600; text-align: center;">C: 50-59%</td>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #ffe0b2; font-weight: 600; text-align: center;">D: 40-49%</td>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #ffccbc; font-weight: 600; text-align: center;">E: 33-39%</td>
//               <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #ffcdd2; font-weight: 600; text-align: center;">F: Below 33%</td>
//             </tr>
//           </table>
//         </div>
        
//         <div class="footer">
//           <p>This is a computer-generated progress card.</p>
//           <p style="margin-top: 5px;">Downloaded on: ${new Date().toLocaleDateString('en-US', { 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })}</p>
//         </div>
//       </div>
      
//       <script>
//         // Detect mobile device
//         const isMobile = ${isMobile};
        
//         // Auto print when page loads
//         window.onload = function() {
//           // Wait for all content to load
//           setTimeout(function() {
//             try {
//               // Try to print
//               window.print();
              
//               // For mobile devices, give more time before closing
//               const closeDelay = isMobile ? 1000 : 100;
              
//               // Close window after printing or canceling
//               setTimeout(function() {
//                 window.close();
//               }, closeDelay);
//             } catch (error) {
//               console.error('Print error:', error);
//               // If print fails, keep window open for manual download
//               alert('Please use your browser menu to print or save as PDF');
//             }
//           }, isMobile ? 1000 : 500);
//         };
        
//         // Prevent accidental navigation away
//         window.onbeforeprint = function() {
//           document.body.style.background = 'white';
//         };
        
//         window.onafterprint = function() {
//           // Small delay before closing
//           setTimeout(function() {
//             window.close();
//           }, 100);
//         };
//       </script>
//     </body>
//     </html>
//   `;

//   printWindow.document.write(htmlContent);
//   printWindow.document.close();
// };

// // Mobile-optimized PDF Generator for Progress Card
// const generateProgressCardMobile = (card) => {
//   // Calculate grade based on percentage
//   const getGrade = (percentage) => {
//     if (percentage >= 90) return 'A1';
//     if (percentage >= 80) return 'A2';
//     if (percentage >= 70) return 'B1';
//     if (percentage >= 60) return 'B2';
//     if (percentage >= 50) return 'C';
//     if (percentage >= 40) return 'D';
//     if (percentage >= 33) return 'E';
//     return 'F';
//   };

//   // Calculate test totals
//   const test1Total = card.subjects.reduce((sum, s) => sum + s.test1Marks, 0);
//   const test1FM = card.subjects.reduce((sum, s) => sum + s.test1FM, 0);
//   const test1Percentage = ((test1Total / test1FM) * 100).toFixed(2);
//   const test1Grade = getGrade(parseFloat(test1Percentage));

//   const test2Total = card.subjects.reduce((sum, s) => sum + s.test2Marks, 0);
//   const test2FM = card.subjects.reduce((sum, s) => sum + s.test2FM, 0);
//   const test2Percentage = ((test2Total / test2FM) * 100).toFixed(2);
//   const test2Grade = getGrade(parseFloat(test2Percentage));

//   const halfYearlyTotal = card.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0);
//   const halfYearlyFM = card.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0);
//   const halfYearlyPercentage = ((halfYearlyTotal / halfYearlyFM) * 100).toFixed(2);
//   const halfYearlyGrade = getGrade(parseFloat(halfYearlyPercentage));

//   const test3Total = card.subjects.reduce((sum, s) => sum + s.test3Marks, 0);
//   const test3FM = card.subjects.reduce((sum, s) => sum + s.test3FM, 0);
//   const test3Percentage = ((test3Total / test3FM) * 100).toFixed(2);
//   const test3Grade = getGrade(parseFloat(test3Percentage));

//   const annualTotal = card.subjects.reduce((sum, s) => sum + s.annualMarks, 0);
//   const annualFM = card.subjects.reduce((sum, s) => sum + s.annualFM, 0);
//   const annualPercentage = ((annualTotal / annualFM) * 100).toFixed(2);
//   const annualGrade = getGrade(parseFloat(annualPercentage));

//   // Open in new tab with print-ready content
//   const printWindow = window.open('', '_blank');
  
//   if (!printWindow) {
//     alert('Please allow pop-ups to download the progress card');
//     return;
//   }

//   // Generate HTML for mobile with manual print button
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Progress Card - ${card.studentName}</title>
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           -webkit-print-color-adjust: exact;
//           print-color-adjust: exact;
//         }
        
//         @page {
//           size: A4 portrait;
//           margin: 8mm;
//         }
        
//         body {
//           font-family: Arial, sans-serif;
//           padding: 5px;
//           background: #f5f5f5;
//           font-size: 10px;
//           line-height: 1.3;
//         }
        
//         .progress-card {
//           background: white;
//           padding: 12px;
//           border: 2px solid #667eea;
//           max-width: 100%;
//           position: relative;
//         }
        
//         .watermark {
//           position: fixed;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%) rotate(-45deg);
//           font-size: 60px;
//           font-weight: bold;
//           color: rgba(102, 126, 234, 0.08);
//           text-transform: uppercase;
//           pointer-events: none;
//           z-index: 0;
//           white-space: nowrap;
//         }
        
//         .button-container {
//           text-align: center;
//           margin: 15px 0;
//           padding: 15px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           border-radius: 10px;
//         }
        
//         .download-btn {
//           background: #28a745;
//           color: white;
//           border: none;
//           padding: 15px 30px;
//           font-size: 18px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-weight: 600;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.3);
//           width: 100%;
//           max-width: 300px;
//         }
        
//         .download-btn:active {
//           transform: scale(0.98);
//           box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//         }
        
//         .instructions {
//           margin-top: 10px;
//           color: white;
//           font-size: 13px;
//           line-height: 1.6;
//           text-align: center;
//         }
        
//         .institute-header {
//           text-align: center;
//           margin-bottom: 8px;
//         }
        
//         .the-mother {
//           font-size: 16px;
//           font-weight: bold;
//           color: #2c3e50;
//           text-decoration: underline;
//           text-underline-offset: 4px;
//           margin-bottom: 5px;
//         }
        
//         .institute-name {
//           font-size: 11px;
//           font-weight: 600;
//           color: #2c3e50;
//           line-height: 1.4;
//           margin-bottom: 10px;
//         }
        
//         .header {
//           text-align: center;
//           margin: 15px 0;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #667eea;
//           position: relative;
//           z-index: 1;
//         }
        
//         .header h1 {
//           font-size: 20px;
//           color: #667eea;
//           margin-bottom: 5px;
//           text-transform: uppercase;
//           letter-spacing: 1.5px;
//         }
        
//         .header h2 {
//           color: #764ba2;
//           font-size: 14px;
//           margin-bottom: 3px;
//         }
        
//         .student-info {
//           margin: 6px 0;
//           padding: 8px;
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
//           border-radius: 6px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .student-info table {
//           width: 100%;
//           border-collapse: collapse;
//           font-size: 9px;
//         }
        
//         .student-info td {
//           padding: 3px;
//         }
        
//         .student-info td:first-child {
//           font-weight: bold;
//           color: #2c3e50;
//           width: 100px;
//         }
        
//         .marks-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 8px 0;
//           font-size: 8px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .marks-table th {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 5px 3px;
//           border: 1px solid #ddd;
//           font-size: 8px;
//           text-align: center;
//         }
        
//         .marks-table td {
//           padding: 4px 3px;
//           border: 1px solid #ddd;
//           text-align: center;
//           font-size: 8px;
//         }
        
//         .marks-table tbody tr:nth-child(even) {
//           background: #f8f9fa;
//         }
        
//         .total-row {
//           background: #e9ecef !important;
//           font-weight: bold;
//           font-size: 9px;
//         }
        
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
          
//           body {
//             padding: 0;
//             background: white;
//           }
          
//           .button-container {
//             display: none !important;
//           }
          
//           .progress-card {
//             border: 2px solid #667eea;
//             page-break-inside: avoid;
//           }
          
//           .watermark {
//             display: block !important;
//           }
          
//           @page {
//             size: A4 portrait;
//             margin: 10mm;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="button-container">
//         <button class="download-btn" onclick="window.print()">📥 Download / Print PDF</button>
//         <div class="instructions">
//           <p><strong>Instructions:</strong></p>
//           <p>1. Tap the button above</p>
//           <p>2. Select "Save as PDF" in print options</p>
//           <p>3. Choose download location</p>
//         </div>
//       </div>
      
//       <div class="progress-card">
//         <div class="watermark">Udiyaman Matrukhetra</div>
        
//         <div class="institute-header">
//           <div class="the-mother">THE MOTHER</div>
//           <div style="font-size: 10px; font-style: italic; color: #667eea; margin-bottom: 8px; font-weight: 600; letter-spacing: 0.5px;">DO NOT AIM AT SUCCESS OUR AIM PERFECTION</div>
//           <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
//         </div>
        
//         <div class="header">
//           <h1>Progress Card</h1>
//           <h2>${card.year || 'Academic Year'}</h2>
//         </div>
        
//         <div class="student-info">
//           <table>
//             <tr>
//               <td>Student Name:</td>
//               <td>${card.studentName}</td>
//               <td style="width: 30px;"></td>
//               <td style="font-weight: bold; color: #2c3e50;">Class:</td>
//               <td>${card.class}</td>
//             </tr>
//             <tr>
//               <td>Father's Name:</td>
//               <td>${card.fatherName || 'N/A'}</td>
//               <td style="width: 30px;"></td>
//               <td style="font-weight: bold; color: #2c3e50;">Roll Number:</td>
//               <td>${card.rollNumber}</td>
//             </tr>
//             <tr>
//               <td>Mother's Name:</td>
//               <td>${card.motherName || 'N/A'}</td>
//               <td style="width: 30px;"></td>
//               <td style="font-weight: bold; color: #2c3e50;">Aadhaar No:</td>
//               <td>${card.aadhaarNumber.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}</td>
//             </tr>
//           </table>
//         </div>
        
//         <table class="marks-table">
//           <thead>
//             <tr>
//               <th>Subject</th>
//               <th>1st Unit Test</th>
//               <th>2nd Unit Test</th>
//               <th>Half Yearly</th>
//               <th>3rd Unit Test</th>
//               <th>Annual</th>
//               <th>Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${card.subjects.map(subject => `
//               <tr>
//                 <td style="text-align: left; font-weight: 600;">${subject.name}</td>
//                 <td>${subject.test1Marks}/${subject.test1FM}</td>
//                 <td>${subject.test2Marks}/${subject.test2FM}</td>
//                 <td>${subject.halfYearlyMarks}/${subject.halfYearlyFM}</td>
//                 <td>${subject.test3Marks}/${subject.test3FM}</td>
//                 <td>${subject.annualMarks}/${subject.annualFM}</td>
//                 <td style="text-align: left; font-style: italic;">${subject.remarks || ''}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td style="text-align: left;">TOTAL</td>
//               <td>${test1Total}/${test1FM}</td>
//               <td>${test2Total}/${test2FM}</td>
//               <td>${halfYearlyTotal}/${halfYearlyFM}</td>
//               <td>${test3Total}/${test3FM}</td>
//               <td>${annualTotal}/${annualFM}</td>
//               <td style="text-align: left;">${card.remarks || ''}</td>
//             </tr>
//           </tbody>
//         </table>
        
//         <!-- Attendance Table -->
//         <div style="margin: 4px 0;">
//           <h3 style="font-size: 8px; color: #2c3e50; margin-bottom: 3px; text-align: center; font-weight: 700;">Attendance Record</h3>
//           <table style="width: 100%; border-collapse: collapse; font-size: 6px; border: 1px solid #ddd; position: relative; z-index: 1;">
//             <thead>
//               <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
//                 <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">Exam</th>
//                 <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">Working Days</th>
//                 <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">Present</th>
//                 <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">%</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr style="background: #fff3cd;">
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Half Yearly</td>
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center;">${card.halfYearlyWorkingDays || 0}</td>
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.halfYearlyDaysPresent || 0}</td>
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #667eea;">${card.halfYearlyWorkingDays > 0 ? ((card.halfYearlyDaysPresent / card.halfYearlyWorkingDays) * 100).toFixed(1) : 0}%</td>
//               </tr>
//               <tr style="background: #d1ecf1;">
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Annual</td>
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center;">${card.annualWorkingDays || 0}</td>
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.annualDaysPresent || 0}</td>
//                 <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #667eea;">${card.annualWorkingDays > 0 ? ((card.annualDaysPresent / card.annualWorkingDays) * 100).toFixed(1) : 0}%</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
        
//         <!-- Test-wise Performance with Signatures -->
//         <div style="margin: 4px 0; position: relative; z-index: 1;">
//           <h3 style="font-size: 8px; color: #2c3e50; margin-bottom: 3px; text-align: center;">Test-wise Performance</h3>
//           <table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
//             <tr>
//               <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">1st Unit Test</strong>
//                 <div style="margin-bottom: 2px;">
//                   <span style="font-size: 8px; font-weight: bold; color: #667eea;">${test1Grade}</span>
//                   <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${test1Percentage}%)</span>
//                 </div>
//                 <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">2nd Unit Test</strong>
//                 <div style="margin-bottom: 2px;">
//                   <span style="font-size: 8px; font-weight: bold; color: #667eea;">${test2Grade}</span>
//                   <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${test2Percentage}%)</span>
//                 </div>
//                 <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">Half Yearly</strong>
//                 <div style="margin-bottom: 2px;">
//                   <span style="font-size: 8px; font-weight: bold; color: #667eea;">${halfYearlyGrade}</span>
//                   <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${halfYearlyPercentage}%)</span>
//                 </div>
//                 <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">3rd Unit Test</strong>
//                 <div style="margin-bottom: 2px;">
//                   <span style="font-size: 8px; font-weight: bold; color: #667eea;">${test3Grade}</span>
//                   <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${test3Percentage}%)</span>
//                 </div>
//                 <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">Annual</strong>
//                 <div style="margin-bottom: 2px;">
//                   <span style="font-size: 8px; font-weight: bold; color: #667eea;">${annualGrade}</span>
//                   <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${annualPercentage}%)</span>
//                 </div>
//                 <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
//                   <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
//                   <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
//                 </div>
//               </td>
//               <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
//                 <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">Principal</strong>
//                 <div style="margin-top: 8px; margin-bottom: 3px; text-align: center;">
//                   <div style="font-family: 'Brush Script MT', cursive; font-size: 9px; color: #2c3e50; font-weight: bold;">Ramesh Ch. Suhula</div>
//                 </div>
//                 <div style="margin-top: 5px; padding-top: 3px; border-top: 1px solid #000; text-align: center;">
//                   <span style="font-size: 5px; color: #6c757d; font-weight: 600;">Principal</span><br>
//                   <span style="font-size: 5px; color: #6c757d;">Udiyaman Matrukhetra</span>
//                 </div>
//               </td>
//             </tr>
//           </table>
//         </div>
        
//         <!-- Promotion Status -->
//         <div style="margin: 4px 0; padding: 4px; border-radius: 4px; border: 2px solid ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'}; background: ${card.promotionStatus === 'Promoted' ? '#d4edda' : '#f8d7da'}; position: relative; z-index: 1;">
//           <div style="display: flex; align-items: center; gap: 4px;">
//             <span style="font-size: 12px; font-weight: bold; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
//               ${card.promotionStatus === 'Promoted' ? '✓' : '✗'}
//             </span>
//             <span style="font-size: 8px; font-weight: 700; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
//               ${card.promotionStatus === 'Promoted' ? 'Promoted to Next Higher Class' : 'Not Promoted'}
//             </span>
//           </div>
//         </div>
        
//         <!-- Grading Scale -->
//         <div style="margin: 4px 0; padding: 4px; border-radius: 4px; background: #f8f9fa; border: 1px solid #dee2e6; position: relative; z-index: 1;">
//           <h3 style="font-size: 7px; color: #2c3e50; margin-bottom: 3px; text-align: center; font-weight: 700;">Grading Scale</h3>
//           <table style="width: 100%; border-collapse: collapse; font-size: 6px;">
//             <tr>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A1: 90-100%</td>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A2: 80-89%</td>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B1: 70-79%</td>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B2: 60-69%</td>
//             </tr>
//             <tr>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #fff3e0; font-weight: 600; text-align: center;">C: 50-59%</td>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #ffe0b2; font-weight: 600; text-align: center;">D: 40-49%</td>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #ffccbc; font-weight: 600; text-align: center;">E: 33-39%</td>
//               <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #ffcdd2; font-weight: 600; text-align: center;">F: Below 33%</td>
//             </tr>
//           </table>
//         </div>
        
//         <!-- Footer -->
//         <div style="margin: 4px 0; text-align: center; font-size: 5px; color: #6c757d; position: relative; z-index: 1;">
//           <p>This is a computer-generated progress card</p>
//           <p>Downloaded on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   printWindow.document.write(htmlContent);
//   printWindow.document.close();
// };

// // Mobile-optimized PDF Generator for Mark Card
// const generateMarkCardMobile = (result) => {
//   // Calculate grade based on percentage
//   const getGrade = (percentage) => {
//     if (percentage >= 90) return 'A1';
//     if (percentage >= 80) return 'A2';
//     if (percentage >= 70) return 'B1';
//     if (percentage >= 60) return 'B2';
//     if (percentage >= 50) return 'C';
//     if (percentage >= 40) return 'D';
//     if (percentage >= 33) return 'E';
//     return 'F';
//   };

//   const grade = getGrade(result.percentage);

//   // Open in new tab with print-ready content
//   const printWindow = window.open('', '_blank');
  
//   if (!printWindow) {
//     alert('Please allow pop-ups to download the mark card');
//     return;
//   }

//   // Generate HTML for mobile with manual print button
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Mark Sheet - ${result.studentName}</title>
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           -webkit-print-color-adjust: exact;
//           print-color-adjust: exact;
//         }
        
//         @page {
//           size: A4 portrait;
//           margin: 15mm;
//         }
        
//         body {
//           font-family: Arial, sans-serif;
//           padding: 5px;
//           background: #f5f5f5;
//           font-size: 12px;
//           line-height: 1.3;
//         }
        
//         .mark-card {
//           background: white;
//           padding: 20px;
//           border: 2px solid #667eea;
//           max-width: 100%;
//           position: relative;
//         }
        
//         .watermark {
//           position: fixed;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%) rotate(-45deg);
//           font-size: 60px;
//           font-weight: bold;
//           color: rgba(102, 126, 234, 0.08);
//           text-transform: uppercase;
//           pointer-events: none;
//           z-index: 0;
//           white-space: nowrap;
//         }
        
//         .button-container {
//           text-align: center;
//           margin: 15px 0;
//           padding: 15px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           border-radius: 10px;
//         }
        
//         .download-btn {
//           background: #28a745;
//           color: white;
//           border: none;
//           padding: 15px 30px;
//           font-size: 18px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-weight: 600;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.3);
//           width: 100%;
//           max-width: 300px;
//         }
        
//         .download-btn:active {
//           transform: scale(0.98);
//           box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//         }
        
//         .instructions {
//           margin-top: 10px;
//           color: white;
//           font-size: 13px;
//           line-height: 1.6;
//           text-align: center;
//         }
        
//         .institute-header {
//           text-align: center;
//           margin-bottom: 10px;
//         }
        
//         .the-mother {
//           font-size: 16px;
//           font-weight: bold;
//           color: #2c3e50;
//           text-decoration: underline;
//           text-underline-offset: 4px;
//           margin-bottom: 5px;
//         }
        
//         .institute-name {
//           font-size: 11px;
//           font-weight: 600;
//           color: #2c3e50;
//           line-height: 1.4;
//           margin-bottom: 10px;
//         }
        
//         .header {
//           text-align: center;
//           margin: 15px 0;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #667eea;
//           position: relative;
//           z-index: 1;
//         }
        
//         .header h1 {
//           font-size: 20px;
//           color: #667eea;
//           margin-bottom: 5px;
//           text-transform: uppercase;
//           letter-spacing: 1.5px;
//         }
        
//         .header h2 {
//           color: #764ba2;
//           font-size: 14px;
//           margin-bottom: 3px;
//         }
        
//         .student-info {
//           margin: 12px 0;
//           padding: 12px;
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
//           border-radius: 6px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .student-info table {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .student-info td {
//           padding: 5px;
//           font-size: 12px;
//         }
        
//         .student-info td:first-child {
//           font-weight: bold;
//           color: #2c3e50;
//           width: 120px;
//         }
        
//         .marks-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 12px 0;
//           font-size: 11px;
//           position: relative;
//           z-index: 1;
//         }
        
//         .marks-table th {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 8px 6px;
//           border: 1px solid #ddd;
//           font-size: 11px;
//           text-align: center;
//         }
        
//         .marks-table td {
//           padding: 6px;
//           border: 1px solid #ddd;
//           text-align: center;
//           font-size: 11px;
//         }
        
//         .marks-table tbody tr:nth-child(even) {
//           background: #f8f9fa;
//         }
        
//         .total-row {
//           background: #e9ecef !important;
//           font-weight: bold;
//           font-size: 12px;
//         }
        
//         .result-summary {
//           margin: 12px 0;
//           padding: 12px;
//           background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
//           border-radius: 6px;
//           border: 2px solid #667eea;
//           position: relative;
//           z-index: 1;
//         }
        
//         .result-summary table {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .result-summary td {
//           padding: 6px;
//           font-size: 12px;
//         }
        
//         .result-summary td:first-child {
//           font-weight: bold;
//           color: #2c3e50;
//           width: 120px;
//         }
        
//         .grade-display {
//           font-size: 18px;
//           color: #667eea;
//           font-weight: bold;
//         }
        
//         .percentage-display {
//           font-size: 16px;
//           color: ${result.percentage >= 60 ? '#28a745' : '#dc3545'};
//           font-weight: bold;
//         }
        
//         .signature-section {
//           margin-top: 20px;
//           padding: 15px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-end;
//           position: relative;
//           z-index: 1;
//         }
        
//         .signature-box {
//           text-align: center;
//           flex: 1;
//           margin: 0 10px;
//         }
        
//         .signature-line {
//           border-top: 1px solid #000;
//           margin-top: 40px;
//           padding-top: 5px;
//         }
        
//         .signature-name {
//           font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
//           font-size: 14px;
//           color: #2c3e50;
//           font-weight: bold;
//           font-style: italic;
//           margin-bottom: 5px;
//         }
        
//         .signature-title {
//           font-size: 11px;
//           color: #6c757d;
//           font-weight: 600;
//         }
        
//         .footer {
//           margin-top: 15px;
//           padding-top: 10px;
//           border-top: 1px solid #ddd;
//           text-align: center;
//           color: #6c757d;
//           font-size: 9px;
//           position: relative;
//           z-index: 1;
//         }
        
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
          
//           body {
//             padding: 0;
//             background: white;
//           }
          
//           .button-container {
//             display: none !important;
//           }
          
//           .mark-card {
//             border: 2px solid #667eea;
//             page-break-inside: avoid;
//           }
          
//           .watermark {
//             display: block !important;
//           }
          
//           @page {
//             size: A4 portrait;
//             margin: 15mm;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="button-container">
//         <button class="download-btn" onclick="window.print()">📥 Download / Print PDF</button>
//         <div class="instructions">
//           <p><strong>Instructions:</strong></p>
//           <p>1. Tap the button above</p>
//           <p>2. Select "Save as PDF" in print options</p>
//           <p>3. Choose download location</p>
//         </div>
//       </div>
      
//       <div class="mark-card">
//         <div class="watermark">Udiyaman Matrukhetra</div>
        
//         <div class="institute-header">
//           <div class="the-mother">THE MOTHER</div>
//           <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
//         </div>
        
//         <div class="header">
//           <h1>Mark Sheet</h1>
//           <h2>${result.testType || 'Examination Result'}</h2>
//         </div>
        
//         <div class="student-info">
//           <table>
//             <tr>
//               <td>Student Name:</td>
//               <td>${result.studentName}</td>
//             </tr>
//             <tr>
//               <td>Roll Number:</td>
//               <td>${result.rollNumber}</td>
//             </tr>
//             <tr>
//               <td>Class:</td>
//               <td>${result.class}</td>
//             </tr>
//           </table>
//         </div>
        
//         <table class="marks-table">
//           <thead>
//             <tr>
//               <th>Subject</th>
//               <th>Marks Obtained</th>
//               <th>Maximum Marks</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${result.subjects.map(subject => `
//               <tr>
//                 <td>${subject.name}</td>
//                 <td>${subject.marks}</td>
//                 <td>${subject.maxMarks}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td>TOTAL</td>
//               <td>${result.obtainedMarks}</td>
//               <td>${result.totalMarks}</td>
//             </tr>
//           </tbody>
//         </table>
        
//         <div class="result-summary">
//           <table>
//             <tr>
//               <td>Grade:</td>
//               <td class="grade-display">${grade}</td>
//             </tr>
//             <tr>
//               <td>Percentage:</td>
//               <td class="percentage-display">${result.percentage}%</td>
//             </tr>
//           </table>
//         </div>
        
//         <div class="signature-section">
//           <div class="signature-box">
//             <div class="signature-line">
//               <div class="signature-name">Ramesh Ch. Suhula</div>
//               <div class="signature-title">Principal</div>
//               <div style="font-size: 9px; color: #999; margin-top: 2px;">Udiyaman Matrukhetra</div>
//             </div>
//           </div>
//         </div>
        
//         <div class="footer">
//           <p>This is a computer-generated mark sheet.</p>
//           <p style="margin-top: 5px;">Downloaded on: ${new Date().toLocaleDateString('en-US', { 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })}</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   printWindow.document.write(htmlContent);
//   printWindow.document.close();
// };

// // PDF Generator for Quiz Certificate
// export const generateCertificatePDF = (result) => {
//   // Open in new tab with print-ready content
//   const printWindow = window.open('', '_blank');
  
//   if (!printWindow) {
//     alert('Please allow pop-ups to download the certificate');
//     return;
//   }

//   const completedDate = new Date(result.completedAt).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   // Generate HTML for mobile with manual print button
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Certificate - ${result.userName}</title>
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           -webkit-print-color-adjust: exact;
//           print-color-adjust: exact;
//         }
        
//         @page {
//           size: A4 landscape;
//           margin: 10mm;
//         }
        
//         body {
//           font-family: Georgia, serif;
//           padding: 5px;
//           background: #f5f7fa;
//           font-size: 12px;
//           line-height: 1.4;
//         }
        
//         .button-container {
//           text-align: center;
//           margin: 15px 0;
//           padding: 15px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           border-radius: 10px;
//         }
        
//         .download-btn {
//           background: #28a745;
//           color: white;
//           border: none;
//           padding: 15px 30px;
//           font-size: 18px;
//           border-radius: 8px;
//           cursor: pointer;
//           font-weight: 600;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.3);
//           width: 100%;
//           max-width: 300px;
//         }
        
//         .download-btn:active {
//           transform: scale(0.98);
//           box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//         }
        
//         .instructions {
//           margin-top: 10px;
//           color: white;
//           font-size: 13px;
//           line-height: 1.6;
//           text-align: center;
//         }
        
//         .certificate {
//           background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
//           padding: 1.5rem;
//           max-width: 100%;
//           margin: 0 auto;
//         }
        
//         .certificate-border {
//           border: 3px solid #1a1a2e;
//           padding: 2rem;
//           position: relative;
//           background: white;
//           box-shadow: inset 0 0 0 2px #c9a959, inset 0 0 0 4px #1a1a2e;
//         }
        
//         .certificate-ornament {
//           position: absolute;
//           width: 50px;
//           height: 50px;
//           border: 3px solid #c9a959;
//         }
        
//         .certificate-ornament.top-left {
//           top: -3px;
//           left: -3px;
//           border-right: none;
//           border-bottom: none;
//         }
        
//         .certificate-ornament.top-right {
//           top: -3px;
//           right: -3px;
//           border-left: none;
//           border-bottom: none;
//         }
        
//         .certificate-ornament.bottom-left {
//           bottom: -3px;
//           left: -3px;
//           border-right: none;
//           border-top: none;
//         }
        
//         .certificate-ornament.bottom-right {
//           bottom: -3px;
//           right: -3px;
//           border-left: none;
//           border-top: none;
//         }
        
//         .certificate-watermark {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%) rotate(-45deg);
//           font-size: 4rem;
//           font-weight: 900;
//           color: rgba(201, 169, 89, 0.08);
//           text-transform: uppercase;
//           letter-spacing: 5px;
//           pointer-events: none;
//           z-index: 0;
//           white-space: nowrap;
//         }
        
//         .certificate-content {
//           position: relative;
//           text-align: center;
//           z-index: 1;
//         }
        
//         .certificate-header {
//           margin-bottom: 1.5rem;
//         }
        
//         .logo-circle {
//           width: 70px;
//           height: 70px;
//           background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 0.8rem;
//           border: 4px solid #c9a959;
//         }
        
//         .logo-icon {
//           font-size: 2.5rem;
//           color: #c9a959;
//         }
        
//         .institution-name {
//           font-size: 1.6rem;
//           color: #1a1a2e;
//           margin: 0.8rem 0 0.4rem 0;
//           font-weight: 800;
//           text-transform: uppercase;
//           letter-spacing: 3px;
//         }
        
//         .certificate-divider {
//           width: 100px;
//           height: 3px;
//           background: linear-gradient(90deg, transparent 0%, #c9a959 50%, transparent 100%);
//           margin: 0.8rem auto;
//         }
        
//         .certificate-title {
//           font-size: 1.8rem;
//           color: #1a1a2e;
//           margin: 0.8rem 0;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 2px;
//         }
        
//         .certificate-subtitle {
//           font-size: 1rem;
//           color: #555;
//           font-style: italic;
//           margin-top: 0.4rem;
//         }
        
//         .recipient-name {
//           font-size: 2.5rem;
//           color: #1a1a2e;
//           font-weight: 700;
//           margin: 1.5rem 0 0.5rem;
//           font-family: 'Brush Script MT', cursive;
//           font-style: italic;
//         }
        
//         .name-underline {
//           width: 350px;
//           height: 2px;
//           background: #c9a959;
//           margin: 0 auto;
//         }
        
//         .certificate-body {
//           margin: 1.5rem 0;
//         }
        
//         .achievement-text {
//           font-size: 1rem;
//           color: #444;
//           line-height: 1.6;
//           margin: 0.4rem 0;
//         }
        
//         .course-name {
//           font-size: 1.4rem;
//           color: #1a1a2e;
//           font-weight: 700;
//           margin: 0.8rem 0;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//         }
        
//         .score-badge {
//           width: 110px;
//           height: 110px;
//           background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
//           border-radius: 50%;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           border: 5px solid #c9a959;
//           margin: 1.2rem 0;
//           position: relative;
//         }
        
//         .score-badge::before {
//           content: '';
//           position: absolute;
//           width: 120%;
//           height: 120%;
//           border: 2px dashed #c9a959;
//           border-radius: 50%;
//           opacity: 0.3;
//         }
        
//         .score-inner {
//           text-align: center;
//           z-index: 1;
//         }
        
//         .score-percentage {
//           display: block;
//           font-size: 2rem;
//           color: #c9a959;
//           font-weight: 800;
//           line-height: 1;
//         }
        
//         .score-label {
//           display: block;
//           font-size: 0.8rem;
//           color: #c9a959;
//           margin-top: 0.3rem;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//           font-weight: 600;
//         }
        
//         .score-text {
//           font-size: 0.9rem;
//           color: #666;
//           font-weight: 600;
//           margin-top: 0.8rem;
//         }
        
//         .certificate-footer {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-end;
//           margin-top: 2rem;
//           gap: 1.5rem;
//         }
        
//         .footer-left,
//         .footer-right {
//           flex: 1;
//           text-align: center;
//         }
        
//         .footer-center {
//           flex: 0;
//         }
        
//         .footer-label {
//           font-size: 0.75rem;
//           color: #888;
//           margin: 0 0 0.3rem 0;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//           font-weight: 600;
//         }
        
//         .footer-value {
//           font-size: 1rem;
//           color: #1a1a2e;
//           font-weight: 700;
//           margin: 0.3rem 0;
//         }
        
//         .footer-line {
//           width: 120px;
//           height: 2px;
//           background: #c9a959;
//           margin: 0.4rem auto;
//         }
        
//         .signature-text {
//           font-family: 'Brush Script MT', cursive;
//           font-size: 1.5rem;
//           color: #1a1a2e;
//           font-style: italic;
//           margin: 0.4rem 0;
//         }
        
//         .footer-title {
//           font-size: 0.8rem;
//           color: #1a1a2e;
//           font-weight: 600;
//           margin: 0.3rem 0 0 0;
//         }
        
//         .premium-seal {
//           width: 85px;
//           height: 85px;
//           background: radial-gradient(circle, #c9a959 0%, #b8934d 100%);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border: 4px solid #1a1a2e;
//           position: relative;
//         }
        
//         .premium-seal::before {
//           content: '';
//           position: absolute;
//           width: 130%;
//           height: 130%;
//           border: 2px solid #c9a959;
//           border-radius: 50%;
//           opacity: 0.3;
//         }
        
//         .seal-inner {
//           text-align: center;
//           z-index: 1;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }
        
//         .seal-icon {
//           font-size: 2rem;
//           color: #1a1a2e;
//           margin-bottom: 0.2rem;
//         }
        
//         .seal-text {
//           font-size: 0.65rem;
//           color: #1a1a2e;
//           font-weight: 800;
//           letter-spacing: 1px;
//         }
        
//         .seal-year {
//           font-size: 0.6rem;
//           color: #1a1a2e;
//           font-weight: 600;
//           margin-top: 0.1rem;
//         }
        
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
          
//           body {
//             padding: 0;
//             background: white;
//           }
          
//           .button-container {
//             display: none !important;
//           }
          
//           .certificate {
//             padding: 1rem;
//             page-break-inside: avoid;
//           }
          
//           .certificate-border {
//             page-break-inside: avoid;
//           }
          
//           @page {
//             size: A4 landscape;
//             margin: 10mm;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="button-container">
//         <button class="download-btn" onclick="window.print()">📥 Download / Print PDF</button>
//         <div class="instructions">
//           <p><strong>Instructions:</strong></p>
//           <p>1. Tap the button above</p>
//           <p>2. Select "Save as PDF" in print options</p>
//           <p>3. Choose download location</p>
//         </div>
//       </div>
      
//       <div class="certificate">
//         <div class="certificate-border">
//           <div class="certificate-ornament top-left"></div>
//           <div class="certificate-ornament top-right"></div>
//           <div class="certificate-ornament bottom-left"></div>
//           <div class="certificate-ornament bottom-right"></div>
          
//           <div class="certificate-watermark">Udiyaman Matrukhetra</div>
          
//           <div class="certificate-content">
//             <div class="certificate-header">
//               <div class="logo-circle">
//                 <span class="logo-icon">★</span>
//               </div>
//               <h1 class="institution-name">Udiyaman Matrukhetra</h1>
//               <div class="certificate-divider"></div>
//               <h2 class="certificate-title">Certificate of Excellence</h2>
//               <p class="certificate-subtitle">This is proudly presented to</p>
//             </div>

//             <div>
//               <div class="recipient-name">${result.userName}</div>
//               <div class="name-underline"></div>
//             </div>

//             <div class="certificate-body">
//               <p class="achievement-text">
//                 For successfully demonstrating exceptional knowledge and dedication by completing the
//               </p>
//               <h3 class="course-name">General Knowledge Assessment</h3>
//               <p class="achievement-text">
//                 with outstanding performance and achieving a remarkable score of
//               </p>

//               <div>
//                 <div class="score-badge">
//                   <div class="score-inner">
//                     <span class="score-percentage">${result.percentage}%</span>
//                     <span class="score-label">Excellence</span>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <span class="score-text">
//                   ${result.score} correct answers out of ${result.totalQuestions} questions
//                 </span>
//               </div>
//             </div>

//             <div class="certificate-footer">
//               <div class="footer-left">
//                 <p class="footer-label">Date of Achievement</p>
//                 <p class="footer-value">${completedDate}</p>
//                 <div class="footer-line"></div>
//               </div>

//               <div class="footer-center">
//                 <div class="premium-seal">
//                   <div class="seal-inner">
//                     <span class="seal-icon">★</span>
//                     <span class="seal-text">CERTIFIED</span>
//                     <span class="seal-year">${new Date(result.completedAt).getFullYear()}</span>
//                   </div>
//                 </div>
//               </div>

//               <div class="footer-right">
//                 <p class="footer-label">Authorized By</p>
//                 <div>
//                   <span class="signature-text">Udit Prasad Babu</span>
//                 </div>
//                 <div class="footer-line"></div>
//                 <p class="footer-title">Managing Trustee</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   printWindow.document.write(htmlContent);
//   printWindow.document.close();
// };









// PDF Generator for Student Mark Card
export const generateMarkCardPDF = (result) => {
  // Detect if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // For mobile devices, create a different experience
  if (isMobile) {
    generateMarkCardMobile(result);
    return;
  }
  
  // Create a new window for printing (desktop)
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download the mark card');
    return;
  }

  // Calculate grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A1';
    if (percentage >= 80) return 'A2';
    if (percentage >= 70) return 'B1';
    if (percentage >= 60) return 'B2';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    if (percentage >= 33) return 'E';
    return 'F';
  };

  const grade = getGrade(result.percentage);

  // Generate HTML for the mark card
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Mark Sheet - ${result.studentName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
        }
        
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        
        html {
          width: 210mm;
          height: 297mm;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          padding: 10px;
          background: #f5f5f5;
          font-size: 12px;
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
        }
        
        .mark-card {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 20px;
          border: 2px solid #667eea;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          position: relative;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          font-weight: bold;
          color: rgba(102, 126, 234, 0.08);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
        
        .header {
          text-align: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #667eea;
        }
        
        .header h1 {
          color: #667eea;
          font-size: 20px;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .header h2 {
          color: #764ba2;
          font-size: 14px;
          margin-bottom: 3px;
        }
        
        .institute-header {
          text-align: center;
          margin-bottom: 10px;
        }
        
        .institute-header .the-mother {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          text-decoration: underline;
          text-underline-offset: 4px;
          margin-bottom: 5px;
        }
        
        .institute-header .institute-name {
          font-size: 11px;
          font-weight: 600;
          color: #2c3e50;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        
        .student-info {
          margin: 12px 0;
          padding: 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 6px;
          position: relative;
          z-index: 1;
        }
        
        .student-info table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .student-info td {
          padding: 5px;
          font-size: 12px;
        }
        
        .student-info td:first-child {
          font-weight: bold;
          color: #2c3e50;
          width: 120px;
        }
        
        .marks-table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 11px;
          position: relative;
          z-index: 1;
        }
        
        .marks-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 6px;
          text-align: center;
          font-size: 11px;
          border: 1px solid #ddd;
        }
        
        .marks-table td {
          padding: 6px;
          text-align: center;
          border: 1px solid #ddd;
          font-size: 11px;
        }
        
        .marks-table tbody tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .marks-table tbody tr:hover {
          background: #e9ecef;
        }
        
        .total-row {
          background: #e9ecef !important;
          font-weight: bold;
          font-size: 12px;
        }
        
        .result-summary {
          margin: 12px 0;
          padding: 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-radius: 6px;
          border: 2px solid #667eea;
          position: relative;
          z-index: 1;
        }
        
        .result-summary table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .result-summary td {
          padding: 6px;
          font-size: 12px;
        }
        
        .result-summary td:first-child {
          font-weight: bold;
          color: #2c3e50;
          width: 120px;
        }
        
        .grade-display {
          font-size: 18px;
          color: #667eea;
          font-weight: bold;
        }
        
        .percentage-display {
          font-size: 16px;
          color: ${result.percentage >= 60 ? '#28a745' : '#dc3545'};
          font-weight: bold;
        }
        
        .signature-section {
          margin-top: 20px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          z-index: 1;
        }
        
        .signature-box {
          text-align: center;
          flex: 1;
          margin: 0 10px;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          margin-top: 40px;
          padding-top: 5px;
        }
        
        .signature-name {
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
          font-size: 14px;
          color: #2c3e50;
          font-weight: bold;
          font-style: italic;
          margin-bottom: 5px;
        }
        
        .signature-title {
          font-size: 11px;
          color: #6c757d;
          font-weight: 600;
        }
        
        .footer {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #6c757d;
          font-size: 9px;
        }
        
        .date-print {
          text-align: right;
          margin-top: 8px;
          font-size: 10px;
          color: #6c757d;
        }
        
        /* Mobile specific styles */
        @media screen and (max-width: 768px) {
          html {
            width: 100%;
          }
          
          body {
            padding: 10px;
            font-size: 11px;
            max-width: 100%;
          }
          
          .mark-card {
            padding: 15px;
            width: 100%;
            max-width: 100%;
          }
          
          .marks-table {
            font-size: 10px;
            overflow-x: auto;
          }
          
          .marks-table th,
          .marks-table td {
            padding: 5px 4px;
            font-size: 10px;
          }
          
          .student-info td {
            font-size: 11px;
            padding: 4px;
          }
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white;
          }
          
          body {
            padding: 0;
            background: white;
          }
          
          .mark-card {
            border: 2px solid #667eea;
            box-shadow: none;
            page-break-inside: avoid;
            page-break-after: avoid;
            width: 100%;
            max-width: 100%;
          }
          
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          /* Ensure colors print correctly */
          .marks-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
          }
          
          .watermark {
            display: block !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="mark-card">
        <div class="watermark">Udiyaman Matrukhetra</div>
        
        <div class="institute-header">
          <div class="the-mother">THE MOTHER</div>
          <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
        </div>
        
        <div class="header">
          <h1>Mark Sheet</h1>
          <h2>${result.testType || 'Examination Result'}</h2>
        </div>
        
        <div class="student-info">
          <table>
            <tr>
              <td>Student Name:</td>
              <td>${result.studentName}</td>
            </tr>
            <tr>
              <td>Roll Number:</td>
              <td>${result.rollNumber}</td>
            </tr>
            <tr>
              <td>Class:</td>
              <td>${result.class}</td>
            </tr>
          </table>
        </div>
        
        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Maximum Marks</th>
            </tr>
          </thead>
          <tbody>
            ${result.subjects.map(subject => `
              <tr>
                <td>${subject.name}</td>
                <td>${subject.marks}</td>
                <td>${subject.maxMarks}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td>TOTAL</td>
              <td>${result.obtainedMarks}</td>
              <td>${result.totalMarks}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="result-summary">
          <table>
            <tr>
              <td>Grade:</td>
              <td class="grade-display">${grade}</td>
            </tr>
            <tr>
              <td>Percentage:</td>
              <td class="percentage-display">${result.percentage}%</td>
            </tr>
          </table>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">
              <div class="signature-name">Ramesh Ch. Suhula</div>
              <div class="signature-title">Principal</div>
              <div style="font-size: 9px; color: #999; margin-top: 2px;">Udiyaman Matrukhetra</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated mark sheet.</p>
          <p style="margin-top: 5px;">Downloaded on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
      
      <script>
        // Detect mobile device
        const isMobile = ${isMobile};
        
        // Auto print when page loads
        window.onload = function() {
          // Wait for all content to load
          setTimeout(function() {
            try {
              // Try to print
              window.print();
              
              // For mobile devices, give more time before closing
              const closeDelay = isMobile ? 1000 : 100;
              
              // Close window after printing or canceling
              setTimeout(function() {
                window.close();
              }, closeDelay);
            } catch (error) {
              console.error('Print error:', error);
              // If print fails, keep window open for manual download
              alert('Please use your browser menu to print or save as PDF');
            }
          }, isMobile ? 1000 : 500);
        };
        
        // Prevent accidental navigation away
        window.onbeforeprint = function() {
          document.body.style.background = 'white';
        };
        
        window.onafterprint = function() {
          // Small delay before closing
          setTimeout(function() {
            window.close();
          }, 100);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// PDF Generator for Progress Card
export const generateProgressCardPDF = (card) => {
  // Detect if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // For mobile devices, create a downloadable blob and trigger download
  if (isMobile) {
    generateProgressCardMobile(card);
    return;
  }
  
  // Create a new window for printing (desktop)
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download the progress card');
    return;
  }

  // Calculate grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A1';
    if (percentage >= 80) return 'A2';
    if (percentage >= 70) return 'B1';
    if (percentage >= 60) return 'B2';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    if (percentage >= 33) return 'E';
    return 'F';
  };

  // Calculate test totals
  const test1Total = card.subjects.reduce((sum, s) => sum + s.test1Marks, 0);
  const test1FM = card.subjects.reduce((sum, s) => sum + s.test1FM, 0);
  const test1Percentage = ((test1Total / test1FM) * 100).toFixed(2);
  const test1Grade = getGrade(parseFloat(test1Percentage));

  const test2Total = card.subjects.reduce((sum, s) => sum + s.test2Marks, 0);
  const test2FM = card.subjects.reduce((sum, s) => sum + s.test2FM, 0);
  const test2Percentage = ((test2Total / test2FM) * 100).toFixed(2);
  const test2Grade = getGrade(parseFloat(test2Percentage));

  const halfYearlyTotal = card.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0);
  const halfYearlyFM = card.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0);
  const halfYearlyPercentage = ((halfYearlyTotal / halfYearlyFM) * 100).toFixed(2);
  const halfYearlyGrade = getGrade(parseFloat(halfYearlyPercentage));

  const test3Total = card.subjects.reduce((sum, s) => sum + s.test3Marks, 0);
  const test3FM = card.subjects.reduce((sum, s) => sum + s.test3FM, 0);
  const test3Percentage = ((test3Total / test3FM) * 100).toFixed(2);
  const test3Grade = getGrade(parseFloat(test3Percentage));

  const annualTotal = card.subjects.reduce((sum, s) => sum + s.annualMarks, 0);
  const annualFM = card.subjects.reduce((sum, s) => sum + s.annualFM, 0);
  const annualPercentage = ((annualTotal / annualFM) * 100).toFixed(2);
  const annualGrade = getGrade(parseFloat(annualPercentage));

  // Generate HTML for the progress card
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Progress Card - ${card.studentName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
        }
        
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        
        html {
          width: 210mm;
          height: 297mm;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          padding: 5px;
          background: #f5f5f5;
          font-size: 10px;
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
        }
        
        .progress-card {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 12px;
          border: 2px solid #667eea;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          position: relative;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          font-weight: bold;
          color: rgba(102, 126, 234, 0.08);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
        
        .header {
          text-align: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #667eea;
        }
        
        .header h1 {
          color: #667eea;
          font-size: 20px;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .header h2 {
          color: #764ba2;
          font-size: 14px;
          margin-bottom: 3px;
        }
        
        .institute-header {
          text-align: center;
          margin-bottom: 10px;
        }
        
        .institute-header .the-mother {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          text-decoration: underline;
          text-underline-offset: 4px;
          margin-bottom: 5px;
        }
        
        .institute-header .institute-name {
          font-size: 11px;
          font-weight: 600;
          color: #2c3e50;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        
        .student-info {
          margin: 6px 0;
          padding: 8px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 6px;
          position: relative;
          z-index: 1;
        }
        
        .student-info table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .student-info td {
          padding: 3px;
          font-size: 9px;
        }
        
        .student-info td:first-child {
          font-weight: bold;
          color: #2c3e50;
          width: 100px;
        }
        
        .marks-table {
          width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
          font-size: 8px;
          position: relative;
          z-index: 1;
        }
        
        .marks-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 5px 3px;
          text-align: center;
          font-size: 8px;
          border: 1px solid #ddd;
        }
        
        .marks-table td {
          padding: 4px 3px;
          text-align: center;
          border: 1px solid #ddd;
          font-size: 8px;
        }
        
        .marks-table tbody tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .total-row {
          background: #e9ecef !important;
          font-weight: bold;
          font-size: 9px;
        }
        
        .result-summary {
          margin: 8px 0;
          padding: 8px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-radius: 6px;
          border: 2px solid #667eea;
          position: relative;
          z-index: 1;
        }
        
        .result-summary table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .result-summary td {
          padding: 6px;
          font-size: 12px;
        }
        
        .result-summary td:first-child {
          font-weight: bold;
          color: #2c3e50;
          width: 120px;
        }
        
        .grade-display {
          font-size: 18px;
          color: #667eea;
          font-weight: bold;
        }
        
        .percentage-display {
          font-size: 16px;
          color: ${card.percentage >= 60 ? '#28a745' : '#dc3545'};
          font-weight: bold;
        }
        
        .remarks-section {
          margin: 12px 0;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #667eea;
          position: relative;
          z-index: 1;
        }
        
        .remarks-section h3 {
          font-size: 12px;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .remarks-section p {
          font-size: 11px;
          color: #495057;
          line-height: 1.5;
        }
        
        .footer {
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #6c757d;
          font-size: 7px;
        }
        
        /* Mobile specific styles */
        @media screen and (max-width: 768px) {
          html {
            width: 100%;
          }
          
          body {
            padding: 10px;
            font-size: 9px;
            max-width: 100%;
          }
          
          .progress-card {
            padding: 10px;
            width: 100%;
            max-width: 100%;
          }
          
          .marks-table {
            font-size: 7px;
            overflow-x: auto;
          }
          
          .marks-table th,
          .marks-table td {
            padding: 3px 2px;
            font-size: 7px;
          }
          
          .student-info td {
            font-size: 8px;
            padding: 2px;
          }
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white;
          }
          
          body {
            padding: 0;
            background: white;
          }
          
          .progress-card {
            border: 2px solid #667eea;
            box-shadow: none;
            page-break-inside: avoid;
            page-break-after: avoid;
            width: 100%;
            max-width: 100%;
          }
          
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          
          /* Ensure colors print correctly */
          .marks-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
          }
          
          .watermark {
            display: block !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="progress-card">
        <div class="watermark">Udiyaman Matrukhetra</div>
        
        <div class="institute-header">
          <div class="the-mother">THE MOTHER</div>
          <div style="font-size: 10px; font-style: italic; color: #667eea; margin-bottom: 8px; font-weight: 600; letter-spacing: 0.5px;">DO NOT AIM AT SUCCESS OUR AIM PERFECTION</div>
          <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
        </div>
        
        <div class="header">
          <h1>Progress Card</h1>
          <h2>${card.year || 'Academic Year'}</h2>
        </div>
        
        <div class="student-info">
          <table>
            <tr>
              <td>Student Name:</td>
              <td>${card.studentName}</td>
              <td style="width: 30px;"></td>
              <td>Class:</td>
              <td>${card.class}</td>
            </tr>
            <tr>
              <td>Father's Name:</td>
              <td>${card.fatherName || 'N/A'}</td>
              <td style="width: 30px;"></td>
              <td>Roll Number:</td>
              <td>${card.rollNumber}</td>
            </tr>
            <tr>
              <td>Mother's Name:</td>
              <td>${card.motherName || 'N/A'}</td>
              <td style="width: 30px;"></td>
              <td>Aadhaar No:</td>
              <td>${card.aadhaarNumber.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}</td>
            </tr>
          </table>
        </div>
        
        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>1st Unit Test</th>
              <th>2nd Unit Test</th>
              <th>Half Yearly</th>
              <th>3rd Unit Test</th>
              <th>Annual Exam</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${card.subjects.map(subject => `
              <tr>
                <td style="text-align: left; font-weight: 600;">${subject.name}</td>
                <td>${subject.test1Marks}/${subject.test1FM}</td>
                <td>${subject.test2Marks}/${subject.test2FM}</td>
                <td>${subject.halfYearlyMarks}/${subject.halfYearlyFM}</td>
                <td>${subject.test3Marks}/${subject.test3FM}</td>
                <td>${subject.annualMarks}/${subject.annualFM}</td>
                <td style="text-align: left; font-style: italic;">${subject.remarks || ''}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td style="text-align: left;">GRAND TOTAL</td>
              <td>${test1Total}/${test1FM}</td>
              <td>${test2Total}/${test2FM}</td>
              <td>${halfYearlyTotal}/${halfYearlyFM}</td>
              <td>${test3Total}/${test3FM}</td>
              <td>${annualTotal}/${annualFM}</td>
              <td style="text-align: left; font-style: italic;">${card.remarks || ''}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Attendance Table -->
        <div style="margin: 10px 0;">
          <h3 style="font-size: 10px; color: #2c3e50; margin-bottom: 6px; text-align: center; font-weight: 700;">Attendance Record</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 1px solid #ddd;">
            <thead>
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Exam</th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Total Working Days</th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Days Present</th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fff3cd;">
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Half Yearly</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${card.halfYearlyWorkingDays || 0}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.halfYearlyDaysPresent || 0}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 700; color: #667eea;">${card.halfYearlyWorkingDays > 0 ? ((card.halfYearlyDaysPresent / card.halfYearlyWorkingDays) * 100).toFixed(2) : 0}%</td>
              </tr>
              <tr style="background: #d1ecf1;">
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Annual</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${card.annualWorkingDays || 0}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.annualDaysPresent || 0}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: 700; color: #667eea;">${card.annualWorkingDays > 0 ? ((card.annualDaysPresent / card.annualWorkingDays) * 100).toFixed(2) : 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="result-summary">
          <h3 style="font-size: 10px; color: #2c3e50; margin-bottom: 6px; text-align: center;">Test-wise Performance</h3>
          <table style="width: 100%; table-layout: fixed;">
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">1st Unit Test</strong>
                <div style="margin-bottom: 4px;">
                  <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${test1Grade}</span>
                  <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${test1Percentage}%)</span>
                </div>
                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">2nd Unit Test</strong>
                <div style="margin-bottom: 4px;">
                  <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${test2Grade}</span>
                  <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${test2Percentage}%)</span>
                </div>
                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">Half Yearly</strong>
                <div style="margin-bottom: 4px;">
                  <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${halfYearlyGrade}</span>
                  <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${halfYearlyPercentage}%)</span>
                </div>
                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">3rd Unit Test</strong>
                <div style="margin-bottom: 4px;">
                  <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${test3Grade}</span>
                  <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${test3Percentage}%)</span>
                </div>
                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">Annual Exam</strong>
                <div style="margin-bottom: 4px;">
                  <span style="font-size: 11px; font-weight: bold; color: #667eea;">Grade: ${annualGrade}</span>
                  <span style="font-size: 9px; margin-left: 5px; color: #495057;">(${annualPercentage}%)</span>
                </div>
                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 7px; color: #6c757d; display: block; margin-bottom: 12px;">Signature of Parents/Guardian:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 6px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 8px; color: #6c757d; margin-bottom: 3px;">Principal Signature</strong>
                <div style="margin-top: 18px; margin-bottom: 6px; text-align: center;">
                  <div style="font-family: 'Brush Script MT', 'Lucida Handwriting', cursive; font-size: 12px; color: #2c3e50; font-weight: bold; font-style: italic;">Ramesh Ch. Suhula</div>
                </div>
                <div style="margin-top: 10px; padding-top: 6px; border-top: 1px solid #000; text-align: center;">
                  <span style="font-size: 7px; color: #6c757d; font-weight: 600;">Principal</span><br>
                  <span style="font-size: 6px; color: #6c757d;">Udiyaman Matrukhetra</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin: 8px 0; padding: 8px; border-radius: 6px; border: 2px solid ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'}; background: ${card.promotionStatus === 'Promoted' ? '#d4edda' : '#f8d7da'};">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px; font-weight: bold; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
              ${card.promotionStatus === 'Promoted' ? '✓' : '✗'}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
              ${card.promotionStatus === 'Promoted' ? 'Promoted to Next Higher Class' : 'Not Promoted'}
            </span>
          </div>
        </div>
        
        <div style="margin: 10px 0; padding: 10px; border-radius: 6px; background: #f8f9fa; border: 1px solid #dee2e6;">
          <h3 style="font-size: 11px; color: #2c3e50; margin-bottom: 6px; text-align: center; font-weight: 700;">Grading Scale</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
            <tr>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A1: 90-100%</td>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A2: 80-89%</td>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B1: 70-79%</td>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B2: 60-69%</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #fff3e0; font-weight: 600; text-align: center;">C: 50-59%</td>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #ffe0b2; font-weight: 600; text-align: center;">D: 40-49%</td>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #ffccbc; font-weight: 600; text-align: center;">E: 33-39%</td>
              <td style="padding: 4px 8px; border: 1px solid #dee2e6; background: #ffcdd2; font-weight: 600; text-align: center;">F: Below 33%</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated progress card.</p>
          <p style="margin-top: 5px;">Downloaded on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
      
      <script>
        // Detect mobile device
        const isMobile = ${isMobile};
        
        // Auto print when page loads
        window.onload = function() {
          // Wait for all content to load
          setTimeout(function() {
            try {
              // Try to print
              window.print();
              
              // For mobile devices, give more time before closing
              const closeDelay = isMobile ? 1000 : 100;
              
              // Close window after printing or canceling
              setTimeout(function() {
                window.close();
              }, closeDelay);
            } catch (error) {
              console.error('Print error:', error);
              // If print fails, keep window open for manual download
              alert('Please use your browser menu to print or save as PDF');
            }
          }, isMobile ? 1000 : 500);
        };
        
        // Prevent accidental navigation away
        window.onbeforeprint = function() {
          document.body.style.background = 'white';
        };
        
        window.onafterprint = function() {
          // Small delay before closing
          setTimeout(function() {
            window.close();
          }, 100);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Mobile-optimized PDF Generator for Progress Card
const generateProgressCardMobile = (card) => {
  // Calculate grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A1';
    if (percentage >= 80) return 'A2';
    if (percentage >= 70) return 'B1';
    if (percentage >= 60) return 'B2';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    if (percentage >= 33) return 'E';
    return 'F';
  };

  // Calculate test totals
  const test1Total = card.subjects.reduce((sum, s) => sum + s.test1Marks, 0);
  const test1FM = card.subjects.reduce((sum, s) => sum + s.test1FM, 0);
  const test1Percentage = ((test1Total / test1FM) * 100).toFixed(2);
  const test1Grade = getGrade(parseFloat(test1Percentage));

  const test2Total = card.subjects.reduce((sum, s) => sum + s.test2Marks, 0);
  const test2FM = card.subjects.reduce((sum, s) => sum + s.test2FM, 0);
  const test2Percentage = ((test2Total / test2FM) * 100).toFixed(2);
  const test2Grade = getGrade(parseFloat(test2Percentage));

  const halfYearlyTotal = card.subjects.reduce((sum, s) => sum + s.halfYearlyMarks, 0);
  const halfYearlyFM = card.subjects.reduce((sum, s) => sum + s.halfYearlyFM, 0);
  const halfYearlyPercentage = ((halfYearlyTotal / halfYearlyFM) * 100).toFixed(2);
  const halfYearlyGrade = getGrade(parseFloat(halfYearlyPercentage));

  const test3Total = card.subjects.reduce((sum, s) => sum + s.test3Marks, 0);
  const test3FM = card.subjects.reduce((sum, s) => sum + s.test3FM, 0);
  const test3Percentage = ((test3Total / test3FM) * 100).toFixed(2);
  const test3Grade = getGrade(parseFloat(test3Percentage));

  const annualTotal = card.subjects.reduce((sum, s) => sum + s.annualMarks, 0);
  const annualFM = card.subjects.reduce((sum, s) => sum + s.annualFM, 0);
  const annualPercentage = ((annualTotal / annualFM) * 100).toFixed(2);
  const annualGrade = getGrade(parseFloat(annualPercentage));

  // Open in new tab with print-ready content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download the progress card');
    return;
  }

  // Generate HTML for mobile with manual print button
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Progress Card - ${card.studentName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        @page {
          size: A4 portrait;
          margin: 8mm;
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 5px;
          background: #f5f5f5;
          font-size: 10px;
          line-height: 1.3;
        }
        
        .progress-card {
          background: white;
          padding: 12px;
          border: 2px solid #667eea;
          max-width: 100%;
          position: relative;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          font-weight: bold;
          color: rgba(102, 126, 234, 0.08);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
        
        .button-container {
          text-align: center;
          margin: 15px 0;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .download-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 300px;
        }
        
        .download-btn:active {
          transform: scale(0.98);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .instructions {
          margin-top: 10px;
          color: white;
          font-size: 13px;
          line-height: 1.6;
          text-align: center;
        }
        
        .institute-header {
          text-align: center;
          margin-bottom: 8px;
        }
        
        .the-mother {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          text-decoration: underline;
          text-underline-offset: 4px;
          margin-bottom: 5px;
        }
        
        .institute-name {
          font-size: 11px;
          font-weight: 600;
          color: #2c3e50;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        
        .header {
          text-align: center;
          margin: 15px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #667eea;
          position: relative;
          z-index: 1;
        }
        
        .header h1 {
          font-size: 20px;
          color: #667eea;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .header h2 {
          color: #764ba2;
          font-size: 14px;
          margin-bottom: 3px;
        }
        
        .student-info {
          margin: 6px 0;
          padding: 8px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 6px;
          position: relative;
          z-index: 1;
        }
        
        .student-info table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        
        .student-info td {
          padding: 3px;
        }
        
        .student-info td:first-child {
          font-weight: bold;
          color: #2c3e50;
          width: 100px;
        }
        
        .marks-table {
          width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
          font-size: 8px;
          position: relative;
          z-index: 1;
        }
        
        .marks-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 5px 3px;
          border: 1px solid #ddd;
          font-size: 8px;
          text-align: center;
        }
        
        .marks-table td {
          padding: 4px 3px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 8px;
        }
        
        .marks-table tbody tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .total-row {
          background: #e9ecef !important;
          font-weight: bold;
          font-size: 9px;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            padding: 0;
            background: white;
          }
          
          .button-container {
            display: none !important;
          }
          
          .progress-card {
            border: 2px solid #667eea;
            page-break-inside: avoid;
          }
          
          .watermark {
            display: block !important;
          }
          
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="button-container">
        <button class="download-btn" onclick="window.print()">📥 Download / Print PDF</button>
        <div class="instructions">
          <p><strong>Instructions:</strong></p>
          <p>1. Tap the button above</p>
          <p>2. Select "Save as PDF" in print options</p>
          <p>3. Choose download location</p>
        </div>
      </div>
      
      <div class="progress-card">
        <div class="watermark">Udiyaman Matrukhetra</div>
        
        <div class="institute-header">
          <div class="the-mother">THE MOTHER</div>
          <div style="font-size: 10px; font-style: italic; color: #667eea; margin-bottom: 8px; font-weight: 600; letter-spacing: 0.5px;">DO NOT AIM AT SUCCESS OUR AIM PERFECTION</div>
          <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
        </div>
        
        <div class="header">
          <h1>Progress Card</h1>
          <h2>${card.year || 'Academic Year'}</h2>
        </div>
        
        <div class="student-info">
          <table>
            <tr>
              <td>Student Name:</td>
              <td>${card.studentName}</td>
              <td style="width: 30px;"></td>
              <td style="font-weight: bold; color: #2c3e50;">Class:</td>
              <td>${card.class}</td>
            </tr>
            <tr>
              <td>Father's Name:</td>
              <td>${card.fatherName || 'N/A'}</td>
              <td style="width: 30px;"></td>
              <td style="font-weight: bold; color: #2c3e50;">Roll Number:</td>
              <td>${card.rollNumber}</td>
            </tr>
            <tr>
              <td>Mother's Name:</td>
              <td>${card.motherName || 'N/A'}</td>
              <td style="width: 30px;"></td>
              <td style="font-weight: bold; color: #2c3e50;">Aadhaar No:</td>
              <td>${card.aadhaarNumber.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}</td>
            </tr>
          </table>
        </div>
        
        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>1st Unit Test</th>
              <th>2nd Unit Test</th>
              <th>Half Yearly</th>
              <th>3rd Unit Test</th>
              <th>Annual</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${card.subjects.map(subject => `
              <tr>
                <td style="text-align: left; font-weight: 600;">${subject.name}</td>
                <td>${subject.test1Marks}/${subject.test1FM}</td>
                <td>${subject.test2Marks}/${subject.test2FM}</td>
                <td>${subject.halfYearlyMarks}/${subject.halfYearlyFM}</td>
                <td>${subject.test3Marks}/${subject.test3FM}</td>
                <td>${subject.annualMarks}/${subject.annualFM}</td>
                <td style="text-align: left; font-style: italic;">${subject.remarks || ''}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td style="text-align: left;">TOTAL</td>
              <td>${test1Total}/${test1FM}</td>
              <td>${test2Total}/${test2FM}</td>
              <td>${halfYearlyTotal}/${halfYearlyFM}</td>
              <td>${test3Total}/${test3FM}</td>
              <td>${annualTotal}/${annualFM}</td>
              <td style="text-align: left;">${card.remarks || ''}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Attendance Table -->
        <div style="margin: 4px 0;">
          <h3 style="font-size: 8px; color: #2c3e50; margin-bottom: 3px; text-align: center; font-weight: 700;">Attendance Record</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 6px; border: 1px solid #ddd; position: relative; z-index: 1;">
            <thead>
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">Exam</th>
                <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">Working Days</th>
                <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">Present</th>
                <th style="padding: 3px; border: 1px solid #ddd; text-align: center;">%</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fff3cd;">
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Half Yearly</td>
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center;">${card.halfYearlyWorkingDays || 0}</td>
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.halfYearlyDaysPresent || 0}</td>
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #667eea;">${card.halfYearlyWorkingDays > 0 ? ((card.halfYearlyDaysPresent / card.halfYearlyWorkingDays) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr style="background: #d1ecf1;">
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600;">Annual</td>
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center;">${card.annualWorkingDays || 0}</td>
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${card.annualDaysPresent || 0}</td>
                <td style="padding: 3px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #667eea;">${card.annualWorkingDays > 0 ? ((card.annualDaysPresent / card.annualWorkingDays) * 100).toFixed(1) : 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Test-wise Performance with Signatures -->
        <div style="margin: 4px 0; position: relative; z-index: 1;">
          <h3 style="font-size: 8px; color: #2c3e50; margin-bottom: 3px; text-align: center;">Test-wise Performance</h3>
          <table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
            <tr>
              <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">1st Unit Test</strong>
                <div style="margin-bottom: 2px;">
                  <span style="font-size: 8px; font-weight: bold; color: #667eea;">${test1Grade}</span>
                  <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${test1Percentage}%)</span>
                </div>
                <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">2nd Unit Test</strong>
                <div style="margin-bottom: 2px;">
                  <span style="font-size: 8px; font-weight: bold; color: #667eea;">${test2Grade}</span>
                  <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${test2Percentage}%)</span>
                </div>
                <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">Half Yearly</strong>
                <div style="margin-bottom: 2px;">
                  <span style="font-size: 8px; font-weight: bold; color: #667eea;">${halfYearlyGrade}</span>
                  <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${halfYearlyPercentage}%)</span>
                </div>
                <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">3rd Unit Test</strong>
                <div style="margin-bottom: 2px;">
                  <span style="font-size: 8px; font-weight: bold; color: #667eea;">${test3Grade}</span>
                  <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${test3Percentage}%)</span>
                </div>
                <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">Annual</strong>
                <div style="margin-bottom: 2px;">
                  <span style="font-size: 8px; font-weight: bold; color: #667eea;">${annualGrade}</span>
                  <span style="font-size: 6px; margin-left: 3px; color: #495057;">(${annualPercentage}%)</span>
                </div>
                <div style="margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ddd;">
                  <span style="font-size: 5px; color: #6c757d; display: block; margin-bottom: 6px;">Parent Sign:</span>
                  <div style="border-bottom: 1px solid #000; width: 100%; height: 1px;"></div>
                </div>
              </td>
              <td style="padding: 3px; border: 1px solid #ddd; background: #f8f9fa; width: 33.33%; vertical-align: top;">
                <strong style="display: block; font-size: 6px; color: #6c757d; margin-bottom: 2px;">Principal</strong>
                <div style="margin-top: 8px; margin-bottom: 3px; text-align: center;">
                  <div style="font-family: 'Brush Script MT', cursive; font-size: 9px; color: #2c3e50; font-weight: bold;">Ramesh Ch. Suhula</div>
                </div>
                <div style="margin-top: 5px; padding-top: 3px; border-top: 1px solid #000; text-align: center;">
                  <span style="font-size: 5px; color: #6c757d; font-weight: 600;">Principal</span><br>
                  <span style="font-size: 5px; color: #6c757d;">Udiyaman Matrukhetra</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Promotion Status -->
        <div style="margin: 4px 0; padding: 4px; border-radius: 4px; border: 2px solid ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'}; background: ${card.promotionStatus === 'Promoted' ? '#d4edda' : '#f8d7da'}; position: relative; z-index: 1;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="font-size: 12px; font-weight: bold; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
              ${card.promotionStatus === 'Promoted' ? '✓' : '✗'}
            </span>
            <span style="font-size: 8px; font-weight: 700; color: ${card.promotionStatus === 'Promoted' ? '#28a745' : '#dc3545'};">
              ${card.promotionStatus === 'Promoted' ? 'Promoted to Next Higher Class' : 'Not Promoted'}
            </span>
          </div>
        </div>
        
        <!-- Grading Scale -->
        <div style="margin: 4px 0; padding: 4px; border-radius: 4px; background: #f8f9fa; border: 1px solid #dee2e6; position: relative; z-index: 1;">
          <h3 style="font-size: 7px; color: #2c3e50; margin-bottom: 3px; text-align: center; font-weight: 700;">Grading Scale</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 6px;">
            <tr>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A1: 90-100%</td>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #e8f5e9; font-weight: 600; text-align: center;">A2: 80-89%</td>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B1: 70-79%</td>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #fff9c4; font-weight: 600; text-align: center;">B2: 60-69%</td>
            </tr>
            <tr>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #fff3e0; font-weight: 600; text-align: center;">C: 50-59%</td>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #ffe0b2; font-weight: 600; text-align: center;">D: 40-49%</td>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #ffccbc; font-weight: 600; text-align: center;">E: 33-39%</td>
              <td style="padding: 2px 4px; border: 1px solid #dee2e6; background: #ffcdd2; font-weight: 600; text-align: center;">F: Below 33%</td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="margin: 4px 0; text-align: center; font-size: 5px; color: #6c757d; position: relative; z-index: 1;">
          <p>This is a computer-generated progress card</p>
          <p>Downloaded on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Mobile-optimized PDF Generator for Mark Card
const generateMarkCardMobile = (result) => {
  // Calculate grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A1';
    if (percentage >= 80) return 'A2';
    if (percentage >= 70) return 'B1';
    if (percentage >= 60) return 'B2';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    if (percentage >= 33) return 'E';
    return 'F';
  };

  const grade = getGrade(result.percentage);

  // Open in new tab with print-ready content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download the mark card');
    return;
  }

  // Generate HTML for mobile with manual print button
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mark Sheet - ${result.studentName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 5px;
          background: #f5f5f5;
          font-size: 12px;
          line-height: 1.3;
        }
        
        .mark-card {
          background: white;
          padding: 20px;
          border: 2px solid #667eea;
          max-width: 100%;
          position: relative;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          font-weight: bold;
          color: rgba(102, 126, 234, 0.08);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
        
        .button-container {
          text-align: center;
          margin: 15px 0;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .download-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 300px;
        }
        
        .download-btn:active {
          transform: scale(0.98);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .instructions {
          margin-top: 10px;
          color: white;
          font-size: 13px;
          line-height: 1.6;
          text-align: center;
        }
        
        .institute-header {
          text-align: center;
          margin-bottom: 10px;
        }
        
        .the-mother {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
          text-decoration: underline;
          text-underline-offset: 4px;
          margin-bottom: 5px;
        }
        
        .institute-name {
          font-size: 11px;
          font-weight: 600;
          color: #2c3e50;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        
        .header {
          text-align: center;
          margin: 15px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #667eea;
          position: relative;
          z-index: 1;
        }
        
        .header h1 {
          font-size: 20px;
          color: #667eea;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .header h2 {
          color: #764ba2;
          font-size: 14px;
          margin-bottom: 3px;
        }
        
        .student-info {
          margin: 12px 0;
          padding: 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 6px;
          position: relative;
          z-index: 1;
        }
        
        .student-info table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .student-info td {
          padding: 5px;
          font-size: 12px;
        }
        
        .student-info td:first-child {
          font-weight: bold;
          color: #2c3e50;
          width: 120px;
        }
        
        .marks-table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 11px;
          position: relative;
          z-index: 1;
        }
        
        .marks-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 6px;
          border: 1px solid #ddd;
          font-size: 11px;
          text-align: center;
        }
        
        .marks-table td {
          padding: 6px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 11px;
        }
        
        .marks-table tbody tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .total-row {
          background: #e9ecef !important;
          font-weight: bold;
          font-size: 12px;
        }
        
        .result-summary {
          margin: 12px 0;
          padding: 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-radius: 6px;
          border: 2px solid #667eea;
          position: relative;
          z-index: 1;
        }
        
        .result-summary table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .result-summary td {
          padding: 6px;
          font-size: 12px;
        }
        
        .result-summary td:first-child {
          font-weight: bold;
          color: #2c3e50;
          width: 120px;
        }
        
        .grade-display {
          font-size: 18px;
          color: #667eea;
          font-weight: bold;
        }
        
        .percentage-display {
          font-size: 16px;
          color: ${result.percentage >= 60 ? '#28a745' : '#dc3545'};
          font-weight: bold;
        }
        
        .signature-section {
          margin-top: 20px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          z-index: 1;
        }
        
        .signature-box {
          text-align: center;
          flex: 1;
          margin: 0 10px;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          margin-top: 40px;
          padding-top: 5px;
        }
        
        .signature-name {
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
          font-size: 14px;
          color: #2c3e50;
          font-weight: bold;
          font-style: italic;
          margin-bottom: 5px;
        }
        
        .signature-title {
          font-size: 11px;
          color: #6c757d;
          font-weight: 600;
        }
        
        .footer {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #6c757d;
          font-size: 9px;
          position: relative;
          z-index: 1;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            padding: 0;
            background: white;
          }
          
          .button-container {
            display: none !important;
          }
          
          .mark-card {
            border: 2px solid #667eea;
            page-break-inside: avoid;
          }
          
          .watermark {
            display: block !important;
          }
          
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="button-container">
        <button class="download-btn" onclick="window.print()">📥 Download / Print PDF</button>
        <div class="instructions">
          <p><strong>Instructions:</strong></p>
          <p>1. Tap the button above</p>
          <p>2. Select "Save as PDF" in print options</p>
          <p>3. Choose download location</p>
        </div>
      </div>
      
      <div class="mark-card">
        <div class="watermark">Udiyaman Matrukhetra</div>
        
        <div class="institute-header">
          <div class="the-mother">THE MOTHER</div>
          <div class="institute-name">SRI AUROBINDO INTEGRAL EDUCATION AND RESEARCH CENTRE, UDIYAMAN MATRUKHETRA, DEDARNUAPALI</div>
        </div>
        
        <div class="header">
          <h1>Mark Sheet</h1>
          <h2>${result.testType || 'Examination Result'}</h2>
        </div>
        
        <div class="student-info">
          <table>
            <tr>
              <td>Student Name:</td>
              <td>${result.studentName}</td>
            </tr>
            <tr>
              <td>Roll Number:</td>
              <td>${result.rollNumber}</td>
            </tr>
            <tr>
              <td>Class:</td>
              <td>${result.class}</td>
            </tr>
          </table>
        </div>
        
        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Maximum Marks</th>
            </tr>
          </thead>
          <tbody>
            ${result.subjects.map(subject => `
              <tr>
                <td>${subject.name}</td>
                <td>${subject.marks}</td>
                <td>${subject.maxMarks}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td>TOTAL</td>
              <td>${result.obtainedMarks}</td>
              <td>${result.totalMarks}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="result-summary">
          <table>
            <tr>
              <td>Grade:</td>
              <td class="grade-display">${grade}</td>
            </tr>
            <tr>
              <td>Percentage:</td>
              <td class="percentage-display">${result.percentage}%</td>
            </tr>
          </table>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">
              <div class="signature-name">Ramesh Ch. Suhula</div>
              <div class="signature-title">Principal</div>
              <div style="font-size: 9px; color: #999; margin-top: 2px;">Udiyaman Matrukhetra</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated mark sheet.</p>
          <p style="margin-top: 5px;">Downloaded on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// PDF Generator for Quiz Certificate
export const generateCertificatePDF = (result) => {
  // Open in new tab with print-ready content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download the certificate');
    return;
  }

  const completedDate = new Date(result.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate HTML for mobile with manual print button
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificate - ${result.userName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        @page {
          size: A4 landscape;
          margin: 10mm;
        }
        
        body {
          font-family: Georgia, serif;
          padding: 5px;
          background: #f5f7fa;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .button-container {
          text-align: center;
          margin: 10px 0;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          position: fixed;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          max-width: 90%;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .download-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 25px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 280px;
        }
        
        .download-btn:active {
          transform: scale(0.98);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .instructions {
          margin-top: 8px;
          color: white;
          font-size: 11px;
          line-height: 1.4;
          text-align: center;
        }
        
        .certificate {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 1rem;
          max-width: 100%;
          margin: 0 auto;
        }
        
        .certificate-border {
          border: 2px solid #1a1a2e;
          padding: 1.2rem;
          position: relative;
          background: white;
          box-shadow: inset 0 0 0 1px #c9a959, inset 0 0 0 3px #1a1a2e;
        }
        
        .certificate-ornament {
          position: absolute;
          width: 35px;
          height: 35px;
          border: 2px solid #c9a959;
        }
        
        .certificate-ornament.top-left {
          top: -3px;
          left: -3px;
          border-right: none;
          border-bottom: none;
        }
        
        .certificate-ornament.top-right {
          top: -3px;
          right: -3px;
          border-left: none;
          border-bottom: none;
        }
        
        .certificate-ornament.bottom-left {
          bottom: -3px;
          left: -3px;
          border-right: none;
          border-top: none;
        }
        
        .certificate-ornament.bottom-right {
          bottom: -3px;
          right: -3px;
          border-left: none;
          border-top: none;
        }
        
        .certificate-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 3rem;
          font-weight: 900;
          color: rgba(201, 169, 89, 0.08);
          text-transform: uppercase;
          letter-spacing: 3px;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
        
        .certificate-content {
          position: relative;
          text-align: center;
          z-index: 1;
        }
        
        .certificate-header {
          margin-bottom: 1rem;
        }
        
        .logo-circle {
          width: 55px;
          height: 55px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.6rem;
          border: 3px solid #c9a959;
        }
        
        .logo-icon {
          font-size: 2rem;
          color: #c9a959;
        }
        
        .institution-name {
          font-size: 1.3rem;
          color: #1a1a2e;
          margin: 0.5rem 0 0.3rem 0;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .certificate-divider {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #c9a959 50%, transparent 100%);
          margin: 0.5rem auto;
        }
        
        .certificate-title {
          font-size: 1.4rem;
          color: #1a1a2e;
          margin: 0.5rem 0;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .certificate-subtitle {
          font-size: 0.85rem;
          color: #555;
          font-style: italic;
          margin-top: 0.3rem;
        }
        
        .recipient-name {
          font-size: 2rem;
          color: #1a1a2e;
          font-weight: 700;
          margin: 1rem 0 0.4rem;
          font-family: 'Brush Script MT', cursive;
          font-style: italic;
        }
        
        .name-underline {
          width: 280px;
          height: 2px;
          background: #c9a959;
          margin: 0 auto;
        }
        
        .certificate-body {
          margin: 1rem 0;
        }
        
        .achievement-text {
          font-size: 0.85rem;
          color: #444;
          line-height: 1.5;
          margin: 0.3rem 0;
        }
        
        .course-name {
          font-size: 1.1rem;
          color: #1a1a2e;
          font-weight: 700;
          margin: 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .score-badge {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #c9a959;
          margin: 0.8rem 0;
          position: relative;
        }
        
        .score-badge::before {
          content: '';
          position: absolute;
          width: 120%;
          height: 120%;
          border: 1px dashed #c9a959;
          border-radius: 50%;
          opacity: 0.3;
        }
        
        .score-inner {
          text-align: center;
          z-index: 1;
        }
        
        .score-percentage {
          display: block;
          font-size: 1.6rem;
          color: #c9a959;
          font-weight: 800;
          line-height: 1;
        }
        
        .score-label {
          display: block;
          font-size: 0.65rem;
          color: #c9a959;
          margin-top: 0.2rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        
        .score-text {
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
          margin-top: 0.5rem;
        }
        
        .certificate-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 1.2rem;
          gap: 1rem;
        }
        
        .footer-left,
        .footer-right {
          flex: 1;
          text-align: center;
        }
        
        .footer-center {
          flex: 0;
        }
        
        .footer-label {
          font-size: 0.65rem;
          color: #888;
          margin: 0 0 0.2rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        
        .footer-value {
          font-size: 0.85rem;
          color: #1a1a2e;
          font-weight: 700;
          margin: 0.2rem 0;
        }
        
        .footer-line {
          width: 100px;
          height: 2px;
          background: #c9a959;
          margin: 0.3rem auto;
        }
        
        .signature-text {
          font-family: 'Brush Script MT', cursive;
          font-size: 1.2rem;
          color: #1a1a2e;
          font-style: italic;
          margin: 0.3rem 0;
        }
        
        .footer-title {
          font-size: 0.7rem;
          color: #1a1a2e;
          font-weight: 600;
          margin: 0.2rem 0 0 0;
        }
        
        .premium-seal {
          width: 70px;
          height: 70px;
          background: radial-gradient(circle, #c9a959 0%, #b8934d 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #1a1a2e;
          position: relative;
        }
        
        .premium-seal::before {
          content: '';
          position: absolute;
          width: 130%;
          height: 130%;
          border: 1px solid #c9a959;
          border-radius: 50%;
          opacity: 0.3;
        }
        
        .seal-inner {
          text-align: center;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .seal-icon {
          font-size: 1.6rem;
          color: #1a1a2e;
          margin-bottom: 0.1rem;
        }
        
        .seal-text {
          font-size: 0.55rem;
          color: #1a1a2e;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        
        .seal-year {
          font-size: 0.5rem;
          color: #1a1a2e;
          font-weight: 600;
          margin-top: 0.05rem;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            padding: 0;
            background: white;
          }
          
          .button-container {
            display: none !important;
          }
          
          .certificate {
            padding: 1rem;
            page-break-inside: avoid;
          }
          
          .certificate-border {
            page-break-inside: avoid;
          }
          
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="button-container">
        <button class="download-btn" onclick="window.print()">📥 Download / Print PDF</button>
        <div class="instructions">
          <p><strong>Instructions:</strong></p>
          <p>1. Tap the button above</p>
          <p>2. Select "Save as PDF" in print options</p>
          <p>3. Choose download location</p>
        </div>
      </div>
      
      <div class="certificate">
        <div class="certificate-border">
          <div class="certificate-ornament top-left"></div>
          <div class="certificate-ornament top-right"></div>
          <div class="certificate-ornament bottom-left"></div>
          <div class="certificate-ornament bottom-right"></div>
          
          <div class="certificate-watermark">Udiyaman Matrukhetra</div>
          
          <div class="certificate-content">
            <div class="certificate-header">
              <div class="logo-circle">
                <span class="logo-icon">★</span>
              </div>
              <h1 class="institution-name">Udiyaman Matrukhetra</h1>
              <div class="certificate-divider"></div>
              <h2 class="certificate-title">Certificate of Excellence</h2>
              <p class="certificate-subtitle">This is proudly presented to</p>
            </div>

            <div>
              <div class="recipient-name">${result.userName}</div>
              <div class="name-underline"></div>
            </div>

            <div class="certificate-body">
              <p class="achievement-text">
                For successfully demonstrating exceptional knowledge and dedication by completing the
              </p>
              <h3 class="course-name">General Knowledge Assessment</h3>
              <p class="achievement-text">
                with outstanding performance and achieving a remarkable score of
              </p>

              <div>
                <div class="score-badge">
                  <div class="score-inner">
                    <span class="score-percentage">${result.percentage}%</span>
                    <span class="score-label">Excellence</span>
                  </div>
                </div>
              </div>

              <div>
                <span class="score-text">
                  ${result.score} correct answers out of ${result.totalQuestions} questions
                </span>
              </div>
            </div>

            <div class="certificate-footer">
              <div class="footer-left">
                <p class="footer-label">Date of Achievement</p>
                <p class="footer-value">${completedDate}</p>
                <div class="footer-line"></div>
              </div>

              <div class="footer-center">
                <div class="premium-seal">
                  <div class="seal-inner">
                    <span class="seal-icon">★</span>
                    <span class="seal-text">CERTIFIED</span>
                    <span class="seal-year">${new Date(result.completedAt).getFullYear()}</span>
                  </div>
                </div>
              </div>

              <div class="footer-right">
                <p class="footer-label">Authorized By</p>
                <div>
                  <span class="signature-text">Udit Prasad Babu</span>
                </div>
                <div class="footer-line"></div>
                <p class="footer-title">Managing Trustee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
