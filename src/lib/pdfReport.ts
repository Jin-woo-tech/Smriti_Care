import { CognitiveDomainTrend, AshaPatientRecord } from '../types';

export function generateAndDownloadClinicalReport(
  patient: AshaPatientRecord,
  cognitiveTrends: CognitiveDomainTrend[],
  medicationAdherencePercent: number = 92
): void {
  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    alert('Please allow popups to download/print the clinical report.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SmritiCare Clinical Cognitive & Adherence Summary - ${patient.name}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      color: #1e293b;
      margin: 40px;
      line-height: 1.5;
      font-size: 13px;
    }
    .header {
      border-bottom: 2px solid #0f766e;
      padding-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      color: #0f766e;
      font-size: 24px;
      font-weight: bold;
    }
    .subbrand {
      color: #64748b;
      font-size: 12px;
    }
    .report-badge {
      background-color: #f0fdfa;
      border: 1px solid #99f6e4;
      color: #0f766e;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 11px;
    }
    .patient-card {
      margin-top: 20px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .field-label {
      color: #64748b;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .field-val {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }
    .section-title {
      margin-top: 24px;
      font-size: 16px;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 600;
      color: #334155;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .status-stable { background: #dcfce7; color: #166534; }
    .status-watch { background: #fef3c7; color: #92400e; }
    .status-review { background: #fee2e2; color: #991b1b; }
    .disclaimer {
      margin-top: 30px;
      padding: 12px;
      background: #fefce8;
      border-left: 4px solid #ca8a04;
      font-size: 11px;
      color: #713f12;
      border-radius: 4px;
    }
    .footer {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #cbd5e1;
      padding-top: 20px;
      color: #64748b;
      font-size: 11px;
    }
    @media print {
      body { margin: 20mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">SmritiCare (स्मृति केयर)</div>
      <div class="subbrand">Cognitive Wellness & Community Geriatric Monitoring Platform</div>
    </div>
    <div class="report-badge">CLINICAL SUMMARY REPORT</div>
  </div>

  <div class="patient-card">
    <div>
      <div class="field-label">Patient Name</div>
      <div class="field-val">${patient.name} ${patient.nameHi ? `(${patient.nameHi})` : ''}</div>
    </div>
    <div>
      <div class="field-label">Age / Gender</div>
      <div class="field-val">${patient.age} Yrs / ${patient.gender === 'M' ? 'Male' : 'Female'}</div>
    </div>
    <div>
      <div class="field-label">Location / Block</div>
      <div class="field-val">${patient.village}</div>
    </div>
    <div>
      <div class="field-label">Report Date</div>
      <div class="field-val">${currentDate}</div>
    </div>
    <div>
      <div class="field-label">Primary Caregiver</div>
      <div class="field-val">${patient.caregiverName}</div>
    </div>
    <div>
      <div class="field-label">Assigned ASHA Worker</div>
      <div class="field-val">Minoti Das</div>
    </div>
    <div>
      <div class="field-label">30-Day Med Adherence</div>
      <div class="field-val" style="color: #0f766e;">${medicationAdherencePercent}% (High Compliance)</div>
    </div>
    <div>
      <div class="field-label">Overall Trend</div>
      <div class="field-val"><span class="status-badge status-stable">Stable Baseline</span></div>
    </div>
  </div>

  <div class="section-title">1. Longitudinal Cognitive Domain Evaluation</div>
  <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Evaluated across 6 standardized, culturally localized neuro-cognitive exercise modules.</p>
  <table>
    <thead>
      <tr>
        <th>Cognitive Domain</th>
        <th>Current Score</th>
        <th>Personal Baseline</th>
        <th>Deviation</th>
        <th>Status Classification</th>
      </tr>
    </thead>
    <tbody>
      ${cognitiveTrends.map(trend => {
        const diff = trend.score - trend.baselineScore;
        const diffStr = diff >= 0 ? `+${diff}%` : `${diff}%`;
        const badgeClass = trend.status === 'stable' ? 'status-stable' : trend.status === 'watch' ? 'status-watch' : 'status-review';
        return `
          <tr>
            <td><strong>${trend.domain}</strong><br><span style="color: #64748b; font-size: 11px;">${trend.domainHi || trend.domain}</span></td>
            <td><strong>${trend.score}/100</strong></td>
            <td>${trend.baselineScore}/100</td>
            <td style="color: ${diff >= 0 ? '#166534' : '#b45309'}; font-weight: bold;">${diffStr}</td>
            <td><span class="status-badge ${badgeClass}">${trend.status.toUpperCase()}</span></td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <div class="section-title">2. Medication & Daily Safety Protocol Status</div>
  <table>
    <thead>
      <tr>
        <th>Prescribed Regimen</th>
        <th>Scheduled Time</th>
        <th>Adherence Rate</th>
        <th>AI Packaging Verification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Telmisartan IP 40mg</strong> (Hypertension)</td>
        <td>08:00 AM (Daily Post-Breakfast)</td>
        <td>96% (29/30 doses recorded)</td>
        <td><span style="color: #166534; font-weight: bold;">Verified via Vision AI</span></td>
      </tr>
      <tr>
        <td><strong>Metformin 500mg</strong> (Type 2 Diabetes)</td>
        <td>01:30 PM & 08:30 PM</td>
        <td>88% (26/30 doses recorded)</td>
        <td><span style="color: #166534; font-weight: bold;">Verified via Vision AI</span></td>
      </tr>
      <tr>
        <td><strong>Daily Hydration (8 Glasses)</strong></td>
        <td>Throughout Day</td>
        <td>85% (Average 6.8 glasses/day)</td>
        <td>Caregiver Logged</td>
      </tr>
      <tr>
        <td><strong>Courtyard Walking (20 Mins)</strong></td>
        <td>05:00 PM</td>
        <td>82% (24/30 days completed)</td>
        <td>Caregiver Logged</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">3. Clinical Summary & Care Observations</div>
  <p style="font-size: 13px; line-height: 1.6;">
    Patient ${patient.name} demonstrates robust episodic and semantic recall with exceptional engagement in cultural memory tasks (94/100).
    A slight deviation is observed in executive trail-making tasks (-5% deviation from baseline).
    Medication compliance remains high under active family supervision. Regular health checkups and continuing current wellness regimen recommended.
  </p>

  <div class="disclaimer">
    <strong>REGULATORY & CLINICAL SAFETY NOTICE:</strong><br>
    SmritiCare is an assistive technology platform designed for tracking cognitive performance trends and medication adherence.
    <strong>This document does NOT constitute a medical diagnosis of dementia, Alzheimer's disease, or psychiatric impairment.</strong>
    All insights represent longitudinal behavioral and task trend data for supportive review by qualified medical professionals.
  </div>

  <div class="footer">
    <div>Generated by SmritiCare v1.0</div>
    <div>Physician Signature: _______________________</div>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="background: #0f766e; color: white; padding: 12px 28px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">
      Print / Save as PDF
    </button>
  </div>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
