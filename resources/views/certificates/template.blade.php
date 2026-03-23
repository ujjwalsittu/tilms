<!DOCTYPE html>
<html>
<head>
<style>
    @page { size: landscape; margin: 0; }
    body { margin: 0; padding: 40px; font-family: 'Georgia', serif; background: {{ $bgColor ?? '#ffffff' }}; }
    .certificate { border: 3px solid {{ $borderColor ?? '#1a365d' }}; padding: 50px; text-align: center; min-height: 500px; position: relative; }
    .certificate .inner-border { border: 1px solid {{ $accentColor ?? '#4F46E5' }}; padding: 40px; min-height: 440px; }
    .platform-name { font-size: 14px; letter-spacing: 4px; text-transform: uppercase; color: {{ $accentColor ?? '#4F46E5' }}; margin-bottom: 20px; }
    .title { font-size: {{ $titleFontSize ?? 32 }}px; font-weight: bold; color: #1a365d; margin: 20px 0; }
    .certify-text { font-size: 16px; color: #4a5568; margin: 10px 0; }
    .student-name { font-size: 28px; font-weight: bold; color: #2d3748; margin: 15px 0; font-style: italic; border-bottom: 2px solid {{ $accentColor ?? '#4F46E5' }}; display: inline-block; padding-bottom: 5px; }
    .cohort-name { font-size: 22px; font-weight: bold; color: #2d3748; margin: 15px 0; }
    .details { font-size: 14px; color: #718096; margin: 5px 0; }
    .signatures { display: flex; justify-content: space-around; margin-top: 40px; }
    .signature { text-align: center; }
    .signature .line { border-top: 1px solid #a0aec0; width: 200px; margin: 0 auto 5px; }
    .signature .name { font-weight: bold; font-size: 14px; }
    .signature .position { font-size: 12px; color: #718096; }
    .footer { margin-top: 30px; font-size: 11px; color: #a0aec0; }
    .cert-number { font-family: monospace; }
</style>
</head>
<body>
<div class="certificate">
    <div class="inner-border">
        <div class="platform-name">{{ $platformName ?? 'TILMS' }}</div>
        <div class="title">{{ $titleText ?? 'Certificate of Completion' }}</div>
        <div class="certify-text">This is to certify that</div>
        <div class="student-name">{{ $studentName }}</div>
        <div class="certify-text">has successfully completed the</div>
        <div class="cohort-name">{{ $cohortName }}</div>
        <div class="details">{{ $domain }} program with {{ $completionPercent }}% completion</div>
        <div class="details">Completed on {{ $completionDate }}</div>

        <div class="signatures">
            <div class="signature">
                <div class="line"></div>
                <div class="name">{{ $signatoryName }}</div>
                <div class="position">{{ $signatoryPosition }}</div>
            </div>
            <div class="signature">
                <div class="line"></div>
                <div class="name">{{ $instructorName }}</div>
                <div class="position">Instructor</div>
            </div>
        </div>

        <div class="footer">
            <div class="cert-number">Certificate No: {{ $certificateNumber }}</div>
            <div>Verify at: {{ $verificationUrl }}</div>
        </div>
    </div>
</div>
</body>
</html>
