import { SupportedLanguage } from '../types';

export interface TranslationStrings {
  brandTagline: string;
  goodMorning: string;
  availableWorkingCapital: string;
  monthlySales: string;
  monthlyCashflow: string;
  currentEMI: string;
  businessHealth: string;
  healthy: string;
  askForLoan: string;
  tellUsWhatYouNeed: string;
  listening: string;
  processing: string;
  understanding: string;
  readyToListen: string;
  tapToSpeak: string;
  stopListening: string;
  orTypeInstead: string;
  typeYourRequest: string;
  demoPhrases: string;
  hereIsWhatIUnderstood: string;
  loanAmount: string;
  purpose: string;
  useCase: string;
  confidence: string;
  thatsCorrect: string;
  edit: string;
  whyThisOffer: string;
  financialSnapshot: string;
  workingCapitalOffer: string;
  tenure: string;
  interestRate: string;
  estimatedEMI: string;
  processingFee: string;
  totalPayable: string;
  explainOffer: string;
  viewKeyFacts: string;
  continueBtn: string;
  keyFactsTitle: string;
  listenToSummary: string;
  iUnderstandTerms: string;
  submitApplication: string;
  confirmModalTitle: string;
  cancel: string;
  confirmApplication: string;
  applicationSubmitted: string;
  applicationStatus: string;
  underReview: string;
  myLoans: string;
  repayment: string;
  adminDashboard: string;
  judgeDemo: string;
  runFullDemo: string;
  voiceToCapital: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  English: {
    brandTagline: 'From Voice to Working Capital.',
    goodMorning: 'Good morning',
    availableWorkingCapital: 'Available Working Capital',
    monthlySales: 'Monthly Sales',
    monthlyCashflow: 'Monthly Cash Flow',
    currentEMI: 'Current EMI',
    businessHealth: 'Business Health',
    healthy: 'Healthy',
    askForLoan: 'Ask for a Loan',
    tellUsWhatYouNeed: 'Tell us what you need.',
    listening: 'Listening to your voice...',
    processing: 'Extracting loan intent...',
    understanding: 'Analyzing merchant financial context...',
    readyToListen: 'Tap microphone and speak naturally',
    tapToSpeak: 'Tap to Speak',
    stopListening: 'Stop & Process',
    orTypeInstead: 'Or type your request instead',
    typeYourRequest: 'e.g. I need 2 lakh rupees for Diwali inventory',
    demoPhrases: 'Try a Quick Demo Phrase:',
    hereIsWhatIUnderstood: "Here's what I understood",
    loanAmount: 'Loan Amount',
    purpose: 'Purpose',
    useCase: 'Specific Use',
    confidence: 'Confidence Score',
    thatsCorrect: "That's correct",
    edit: 'Edit Values',
    whyThisOffer: 'Why this offer?',
    financialSnapshot: 'Your Financial Snapshot',
    workingCapitalOffer: 'Working Capital Offer',
    tenure: 'Tenure',
    interestRate: 'Interest Rate',
    estimatedEMI: 'Estimated Monthly EMI',
    processingFee: 'Processing Fee',
    totalPayable: 'Total Repayment',
    explainOffer: 'Explain with Voice',
    viewKeyFacts: 'View Key Facts (KFS)',
    continueBtn: 'Continue',
    keyFactsTitle: 'Before you continue — Key Facts Statement',
    listenToSummary: 'Listen to Voice KFS',
    iUnderstandTerms: 'I understand the simulated loan terms and consent to assessment.',
    submitApplication: 'Submit Application',
    confirmModalTitle: 'Confirm Loan Application',
    cancel: 'Cancel',
    confirmApplication: 'Confirm Application',
    applicationSubmitted: 'Application Submitted Successfully',
    applicationStatus: 'Application Status',
    underReview: 'Under Review',
    myLoans: 'My Loans',
    repayment: 'Repayment Schedule',
    adminDashboard: 'Lender Portal',
    judgeDemo: 'DEMO ENVIRONMENT',
    runFullDemo: 'Run 1-Click Demo',
    voiceToCapital: 'VOICE TO WORKING CAPITAL',
  },
  Hinglish: {
    brandTagline: 'Voice se Working Capital tak.',
    goodMorning: 'Namaste',
    availableWorkingCapital: 'Available Working Capital',
    monthlySales: 'Monthly Bikri (Sales)',
    monthlyCashflow: 'Monthly Cash Flow',
    currentEMI: 'Chal rahi EMI',
    businessHealth: 'Business Health',
    healthy: 'Damdaar (Healthy)',
    askForLoan: 'Loan ke liye bole',
    tellUsWhatYouNeed: 'Bataiye aapko kya zaroorat hai.',
    listening: 'Sun rahe hain... boliye',
    processing: 'Samajh rahe hain...',
    understanding: 'Aapki financial profile check ho rahi hai...',
    readyToListen: 'Mic dabayein aur natural boliye',
    tapToSpeak: 'Bolne ke liye Dabayein',
    stopListening: 'Rokhein aur Check karein',
    orTypeInstead: 'Ya likh kar bataiye',
    typeYourRequest: 'Jaise: Mujhe 2 lakh chahiye stock ke liye',
    demoPhrases: 'Demo Phrase chuniye:',
    hereIsWhatIUnderstood: 'Humne ye samjha',
    loanAmount: 'Loan Rakam',
    purpose: 'Maqsad (Purpose)',
    useCase: 'Kahan use hoga',
    confidence: 'Confidence Score',
    thatsCorrect: 'Haan, bilkul sahi hai',
    edit: 'Badalna chahte hain?',
    whyThisOffer: 'Ye offer kyun mila?',
    financialSnapshot: 'Aapka Financial Snapshot',
    workingCapitalOffer: 'Working Capital Offer',
    tenure: 'Samay (Tenure)',
    interestRate: 'Byaaj Dar (Interest)',
    estimatedEMI: 'Har Mahine ki EMI',
    processingFee: 'Processing Fee',
    totalPayable: 'Kul Wapsi (Total Payable)',
    explainOffer: 'Awaaz mein samjhein',
    viewKeyFacts: 'Key Facts (KFS) dekhein',
    continueBtn: 'Aage Badhein',
    keyFactsTitle: 'Aage badhne se pehle — Zaroori Niyam (KFS)',
    listenToSummary: 'Voice KFS sunein',
    iUnderstandTerms: 'Mujhe simulated loan terms manzoor hain.',
    submitApplication: 'Application Jama Karein',
    confirmModalTitle: 'Loan Application Confirm Karein',
    cancel: 'Cancel',
    confirmApplication: 'Haan, Submit Karein',
    applicationSubmitted: 'Application Jama Ho Gayi Hai',
    applicationStatus: 'Application ki Stithi',
    underReview: 'Jaanch mein hai (Under Review)',
    myLoans: 'Mere Loans',
    repayment: 'Kisht Ki Jankari',
    adminDashboard: 'Lender Admin',
    judgeDemo: 'DEMO ENVIRONMENT',
    runFullDemo: 'Full Demo Chalao',
    voiceToCapital: 'VOICE SE WORKING CAPITAL',
  },
  Hindi: {
    brandTagline: 'आवाज़ से कार्यशील पूंजी तक।',
    goodMorning: 'नमस्ते',
    availableWorkingCapital: 'उपलब्ध कार्यशील पूंजी',
    monthlySales: 'मासिक बिक्री',
    monthlyCashflow: 'मासिक नकदी प्रवाह',
    currentEMI: 'वर्तमान ईएमआई',
    businessHealth: 'व्यापारिक स्थिति',
    healthy: 'स्वस्थ',
    askForLoan: 'ऋण के लिए बोलें',
    tellUsWhatYouNeed: 'बताइए आपको क्या आवश्यकता है।',
    listening: 'आपकी आवाज़ सुन रहे हैं...',
    processing: 'ऋण विवरण निकाला जा रहा है...',
    understanding: 'वित्तीय स्थिति का विश्लेषण जारी है...',
    readyToListen: 'माइक दबाएं और स्वाभाविक रूप से बोलें',
    tapToSpeak: 'बोलने के लिए दबाएं',
    stopListening: 'रोकें और प्रक्रिया करें',
    orTypeInstead: 'या टाइप करके बताएं',
    typeYourRequest: 'उदा: मुझे दिवाली के स्टॉक के लिए 2 लाख चाहिए',
    demoPhrases: 'त्वरित डेमो वाक्यांश चुनें:',
    hereIsWhatIUnderstood: 'हमने यह समझा',
    loanAmount: 'ऋण राशि',
    purpose: 'उद्देश्य',
    useCase: 'उपयोग',
    confidence: 'विश्वसनीयता स्कोर',
    thatsCorrect: 'यह बिल्कुल सही है',
    edit: 'संशोधित करें',
    whyThisOffer: 'यह प्रस्ताव क्यों?',
    financialSnapshot: 'आपकी वित्तीय स्थिति',
    workingCapitalOffer: 'कार्यशील पूंजी ऋण प्रस्ताव',
    tenure: 'अवधि',
    interestRate: 'ब्याज दर',
    estimatedEMI: 'अनुमानित मासिक ईएमआई',
    processingFee: 'प्रोसेसिंग शुल्क',
    totalPayable: 'कुल देय राशि',
    explainOffer: 'आवाज़ में समझाइए',
    viewKeyFacts: 'मुख्य तथ्य पत्र (KFS) देखें',
    continueBtn: 'आगे बढ़ें',
    keyFactsTitle: 'आगे बढ़ने से पहले — मुख्य तथ्य विवरण (KFS)',
    listenToSummary: 'आवाज़ में सारांश सुनें',
    iUnderstandTerms: 'मैं इस डेमो ऋण की शर्तों को समझता हूं।',
    submitApplication: 'आवेदन जमा करें',
    confirmModalTitle: 'ऋण आवेदन की पुष्टि करें',
    cancel: 'रद्द करें',
    confirmApplication: 'आवेदन की पुष्टि करें',
    applicationSubmitted: 'आवेदन सफलतापूर्वक जमा हुआ',
    applicationStatus: 'आवेदन की स्थिति',
    underReview: 'समीक्षाधीन',
    myLoans: 'मेरे ऋण',
    repayment: 'पुनर्भुगतान अनुसूची',
    adminDashboard: 'ऋणदाता डैशबोर्ड',
    judgeDemo: 'डेमो वातावरण',
    runFullDemo: 'पूर्ण डेमो चलाएं',
    voiceToCapital: 'आवाज़ से कार्यशील पूंजी',
  },
  Kannada: {
    brandTagline: 'ಧ್ವನಿಯಿಂದ ಕಾರ್ಯನಿರತ ಬಂಡವಾಳದವರೆಗೆ.',
    goodMorning: 'ಶುಭೋದಯ',
    availableWorkingCapital: 'ಲಭ್ಯವಿರುವ ದುಡಿಯುವ ಬಂಡವಾಳ',
    monthlySales: 'ತಿಂಗಳ ವ್ಯಾಪಾರ (ಮಾರಾಟ)',
    monthlyCashflow: 'ಮಾಸಿಕ ನಗದು ಹರಿವು',
    currentEMI: 'ಹಾಲಿ ಇಎಂಐ',
    businessHealth: 'ವ್ಯವಹಾರದ ಆರೋಗ್ಯ',
    healthy: 'ಉತ್ತಮ ಸ್ಥಿತಿ',
    askForLoan: 'ಸಾಲಕ್ಕಾಗಿ ಮಾತನಾಡಿ',
    tellUsWhatYouNeed: 'ನಿಮಗೆ ಏನು ಬೇಕು ಎಂದು ಹೇಳಿ.',
    listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ...',
    processing: 'ಮಾಹಿತಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    understanding: 'ಆರ್ಥಿಕ ಸ್ಥಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    readyToListen: 'ಮೈಕ್ ಒತ್ತಿ ಸಹಜವಾಗಿ ಮಾತನಾಡಿ',
    tapToSpeak: 'ಮಾತನಾಡಲು ಒತ್ತಿ',
    stopListening: 'ನಿಲ್ಲಿಸಿ',
    orTypeInstead: 'ಅಥವಾ ಟೈಪ್ ಮಾಡಿ',
    typeYourRequest: 'ಉದಾ: ನನಗೆ ಸ್ಟಾಕ್ ಖರೀದಿಸಲು 2 ಲಕ್ಷ ಬೇಕು',
    demoPhrases: 'ಡೆಮೊ ವಾಕ್ಯವನ್ನು ಆರಿಸಿ:',
    hereIsWhatIUnderstood: 'ನಾವು ಅರ್ಥಮಾಡಿಕೊಂಡದ್ದು ಹೀಗಿದೆ',
    loanAmount: 'ಸಾಲದ ಮೊತ್ತ',
    purpose: 'ಉದ್ದೇಶ',
    useCase: 'ಬಳಕೆ',
    confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
    thatsCorrect: 'ಹೌದು, ಇದು ಸರಿ',
    edit: 'ಬದಲಾಯಿಸಿ',
    whyThisOffer: 'ಈ ಆಫರ್ ಏಕೆ ನೀಡಲಾಗಿದೆ?',
    financialSnapshot: 'ನಿಮ್ಮ ಆರ್ಥಿಕ ಚಿತ್ರಣ',
    workingCapitalOffer: 'ವರ್ಕಿಂಗ್ ಕ್ಯಾಪಿಟಲ್ ಆಫರ್',
    tenure: 'ಅವಧಿ',
    interestRate: 'ಬಡ್ಡಿ ದರ',
    estimatedEMI: 'ಅಂದಾಜು ಮಾಸಿಕ ಇಎಂಐ',
    processingFee: 'ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ',
    totalPayable: 'ಒಟ್ಟು ಮರುಪಾವತಿ',
    explainOffer: 'ಧ್ವನಿಯಲ್ಲಿ ವಿವರಿಸಿ',
    viewKeyFacts: 'ಪ್ರಮುಖ ನಿಯಮಗಳು (KFS)',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    keyFactsTitle: 'ಮುಂದುವರಿಯುವ ಮೊದಲು — ಪ್ರಮುಖ ವಿವರಣೆ (KFS)',
    listenToSummary: 'ಸಾರಾಂಶವನ್ನು ಆಲಿಸಿ',
    iUnderstandTerms: 'ನಾನು ಷರತ್ತುಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ.',
    submitApplication: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    confirmModalTitle: 'ಸಾಲದ ಅರ್ಜಿಯನ್ನು ದೃಢೀಕರಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    confirmApplication: 'ದೃಢೀಕರಿಸಿ',
    applicationSubmitted: 'ಅರ್ಜಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ',
    applicationStatus: 'ಅರ್ಜಿಯ ಸ್ಥಿತಿ',
    underReview: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    myLoans: 'ನನ್ನ ಸಾಲಗಳು',
    repayment: 'ಮರುಪಾವತಿ ವಿವರ',
    adminDashboard: 'ಲೆಂಡರ್ ಪೋರ್ಟಲ್',
    judgeDemo: 'ಡೆಮೊ ಪರಿಸರ',
    runFullDemo: 'ಸಂಪೂರ್ಣ ಡೆಮೊ ಚಾಲನೆ',
    voiceToCapital: 'ಧ್ವನಿಯಿಂದ ಬಂಡವಾಳ',
  },
  Telugu: {
    brandTagline: 'వాయిస్ నుండి వర్కింగ్ క్యాపిటల్ వరకు.',
    goodMorning: 'శుభోదయం',
    availableWorkingCapital: 'అందుబాటులో ఉన్న వర్కింగ్ క్యాపిటల్',
    monthlySales: 'నెలవారీ అమ్మకాలు',
    monthlyCashflow: 'నెలవారీ నగదు ప్రవాహం',
    currentEMI: 'ప్రస్తుత ఈఎంఐ',
    businessHealth: 'వ్యాపార స్థితి',
    healthy: 'ఆరోగ్యకరం',
    askForLoan: 'రుణం కోసం మాట్లాడండి',
    tellUsWhatYouNeed: 'మీకు ఏమి కావాలో చెప్పండి.',
    listening: 'వింటున్నాము...',
    processing: 'సమాచారం సేకరిస్తున్నాము...',
    understanding: 'ఆర్థిక సమాచారం విశ్లేషణ జరుగుతోంది...',
    readyToListen: 'మైక్ నొక్కి మాట్లాడండి',
    tapToSpeak: 'మాట్లాడటానికి నొక్కండి',
    stopListening: 'ఆపండి',
    orTypeInstead: 'లేదా టైప్ చేయండి',
    typeYourRequest: 'ఉదా: నాకు స్టాక్ కోసం 2 లక్షలు కావాలి',
    demoPhrases: 'డెమో వాక్యాన్ని ఎంచుకోండి:',
    hereIsWhatIUnderstood: 'మేము గ్రహించిన వివరాలు',
    loanAmount: 'రుణ మొత్తం',
    purpose: 'ఉద్దేశం',
    useCase: 'వినియోగం',
    confidence: 'విశ్వసనీయత',
    thatsCorrect: 'అవును, సరైనదే',
    edit: 'సవరించండి',
    whyThisOffer: 'ఈ ఆఫర్ ఎందుకు వచ్చింది?',
    financialSnapshot: 'మీ ఆర్థిక పరిస్థితి',
    workingCapitalOffer: 'వర్కింగ్ క్యాపిటల్ ఆఫర్',
    tenure: 'వ్యవధి',
    interestRate: 'వడ్డీ రేటు',
    estimatedEMI: 'నెలవారీ ఈఎంఐ',
    processingFee: 'ప్రాసెసింగ్ రుసుము',
    totalPayable: 'మొత్తం తిరిగి చెల్లించాల్సిన మొత్తం',
    explainOffer: 'వాయిస్‌లో వివరించండి',
    viewKeyFacts: 'కీలక నిబంధనలు (KFS)',
    continueBtn: 'కొనసాగించండి',
    keyFactsTitle: 'కీలక వాస్తవ పత్రం (KFS)',
    listenToSummary: 'సారాంశం వినండి',
    iUnderstandTerms: 'నేను షరతులను అర్థం చేసుకున్నాను.',
    submitApplication: 'దరఖాస్తు సమర్పించండి',
    confirmModalTitle: 'దరఖాస్తు నిర్ధారించండి',
    cancel: 'రద్దు చేయండి',
    confirmApplication: 'నిర్ధారించండి',
    applicationSubmitted: 'దరఖాస్తు విజయవంతంగా సమర్పించబడింది',
    applicationStatus: 'దరఖాస్తు స్థితి',
    underReview: 'పరిశీలనలో ఉంది',
    myLoans: 'నా రుణాలు',
    repayment: 'చెల్లింపుల వివరాలు',
    adminDashboard: 'లెండర్ పోర్టల్',
    judgeDemo: 'డెమో వాతావరణం',
    runFullDemo: 'పూర్తి డెమో చూడండి',
    voiceToCapital: 'వాయిస్ టు వర్కింగ్ క్యాపిటల్',
  },
  Tamil: {
    brandTagline: 'குரல் வழியே நடைமுறை மூலதனம்.',
    goodMorning: 'காலை வணக்கம்',
    availableWorkingCapital: 'கிடைக்கும் நடைமுறை மூலதனம்',
    monthlySales: 'மாதாந்திர விற்பனை',
    monthlyCashflow: 'மாதாந்திர பணப்புழக்கம்',
    currentEMI: 'தற்போதைய இஎம்ஐ',
    businessHealth: 'வணிக ஆரோக்கியம்',
    healthy: 'ஆரோக்கியமானது',
    askForLoan: 'கடனுக்கு பேசவும்',
    tellUsWhatYouNeed: 'உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்.',
    listening: 'கேட்கிறது...',
    processing: 'புரிந்துகொள்கிறது...',
    understanding: 'நிதி நிலை ஆராயப்படுகிறது...',
    readyToListen: 'மைக்கை அழுத்தி பேசவும்',
    tapToSpeak: 'பேச அழுத்தவும்',
    stopListening: 'நிறுத்து',
    orTypeInstead: 'அல்லது தட்டச்சு செய்யவும்',
    typeYourRequest: 'எ.கா: எனக்கு சரக்கு வாங்க 2 லட்சம் வேண்டும்',
    demoPhrases: 'டெமோ வாக்கியத்தைத் தேர்ந்தெடுக்கவும்:',
    hereIsWhatIUnderstood: 'நாங்கள் புரிந்துகொண்டது',
    loanAmount: 'கடன் தொகை',
    purpose: 'நோக்கம்',
    useCase: 'பயன்பாடு',
    confidence: 'நம்பகத்தன்மை',
    thatsCorrect: 'ஆம், சரியானது',
    edit: 'திருத்து',
    whyThisOffer: 'இந்த சலுகை ஏன்?',
    financialSnapshot: 'உங்கள் நிதி நிலை',
    workingCapitalOffer: 'நடைமுறை மூலதன சலுகை',
    tenure: 'கால அளவு',
    interestRate: 'வட்டி விகிதம்',
    estimatedEMI: 'மாதாந்திர தவணை (EMI)',
    processingFee: 'செயலாக்க கட்டணம்',
    totalPayable: 'மொத்தம் செலுத்த வேண்டிய தொகை',
    explainOffer: 'குரலில் விளக்குங்கள்',
    viewKeyFacts: 'முக்கிய ஆவணம் (KFS)',
    continueBtn: 'தொடரவும்',
    keyFactsTitle: 'முக்கிய உண்மைகள் அறிக்கை (KFS)',
    listenToSummary: 'சுருக்கத்தைக் கேளுங்கள்',
    iUnderstandTerms: 'நிபந்தனைகளை ஏற்றுக்கொள்கிறேன்.',
    submitApplication: 'விண்ணப்பிக்கவும்',
    confirmModalTitle: 'விண்ணப்பத்தை உறுதிப்படுத்தவும்',
    cancel: 'ரத்து செய்',
    confirmApplication: 'உறுதி செய்',
    applicationSubmitted: 'விண்ணப்பம் சமர்ப்பிக்கப்பட்டது',
    applicationStatus: 'விண்ணப்ப நிலை',
    underReview: 'மதிப்பாய்வில் உள்ளது',
    myLoans: 'எனது கடன்கள்',
    repayment: 'திருப்பி செலுத்தும் அட்டவணை',
    adminDashboard: 'கடன் வழங்குநர் தளம்',
    judgeDemo: 'டெமோ சூழல்',
    runFullDemo: 'முழு டெமோ இயக்கவும்',
    voiceToCapital: 'குரல் வழியே மூலதனம்',
  },
  Malayalam: {
    brandTagline: 'ശബ്ദത്തിൽ നിന്ന് പ്രവർത്തന മൂലധനത്തിലേക്ക്.',
    goodMorning: 'സുപ്രഭാതം',
    availableWorkingCapital: 'ലഭ്യമായ പ്രവർത്തന മൂലധനം',
    monthlySales: 'പ്രതിമാസ വിൽപ്പന',
    monthlyCashflow: 'പ്രതിമാസ പണമൊഴുക്ക്',
    currentEMI: 'നിലവിലെ ഇ.എം.ഐ',
    businessHealth: 'വ്യാപാര ആരോഗ്യം',
    healthy: 'മികച്ച നിലയിൽ',
    askForLoan: 'വായ്പയ്ക്കായി സംസാരിക്കുക',
    tellUsWhatYouNeed: 'നിങ്ങൾക്ക് എന്താണ് ആവശ്യമെന്ന് പറയൂ.',
    listening: 'കേൾക്കുന്നു...',
    processing: 'വിവരങ്ങൾ ശേഖരിക്കുന്നു...',
    understanding: 'ധനകാര്യ പശ്ചാത്തലം പരിശോധിക്കുന്നു...',
    readyToListen: 'മൈക്ക് അമർത്തി സംസാരിക്കുക',
    tapToSpeak: 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    stopListening: 'നിർത്തുക',
    orTypeInstead: 'അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക',
    typeYourRequest: 'ഉദാ: എനിക്ക് സ്റ്റോക്കിനായി 2 ലക്ഷം വേണം',
    demoPhrases: 'ഡെമോ വാചകം തിരഞ്ഞെടുക്കുക:',
    hereIsWhatIUnderstood: 'ഞങ്ങൾ മനസ്സിലാക്കിയത്',
    loanAmount: 'വായ്പാ തുക',
    purpose: 'ഉദ്ദേശ്യം',
    useCase: 'ഉപയോഗം',
    confidence: 'വിശ്വാസ്യത',
    thatsCorrect: 'അതെ, ശരിയാണ്',
    edit: 'തിരുത്തുക',
    whyThisOffer: 'എന്തുകൊണ്ട് ഈ ഓഫർ?',
    financialSnapshot: 'സാമ്പത്തിക വിവരങ്ങൾ',
    workingCapitalOffer: 'വർക്കിംഗ് കാപ്പിറ്റൽ ഓഫർ',
    tenure: 'കാലാവധി',
    interestRate: 'പലിശ നിരക്ക്',
    estimatedEMI: 'പ്രതിമാസ ഇ.എം.ഐ',
    processingFee: 'പ്രോസസ്സിംഗ് ഫീസ്',
    totalPayable: 'ആകെ തിരിച്ചടക്കേണ്ട തുക',
    explainOffer: 'ശബ്ദത്തിൽ വിശദീകരിക്കുക',
    viewKeyFacts: 'പ്രധാന വ്യവസ്ഥകൾ (KFS)',
    continueBtn: 'തുടരുക',
    keyFactsTitle: 'പ്രധാന വിവരങ്ങൾ (KFS)',
    listenToSummary: 'സംഗ്രഹം കേൾക്കുക',
    iUnderstandTerms: 'ഞാൻ നിബന്ധനകൾ മനസ്സിലാക്കുന്നു.',
    submitApplication: 'അപേക്ഷ സമർപ്പിക്കുക',
    confirmModalTitle: 'അപേക്ഷ ഉറപ്പാക്കുക',
    cancel: 'റദ്ദാക്കുക',
    confirmApplication: 'ഉറപ്പാക്കുക',
    applicationSubmitted: 'അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു',
    applicationStatus: 'അപേക്ഷാ സ്ഥിതി',
    underReview: 'പരിശോധനയിലാണ്',
    myLoans: 'എന്റെ വായ്പകൾ',
    repayment: 'തിരിച്ചടവ് വിവരങ്ങൾ',
    adminDashboard: 'ലെൻഡർ പോർട്ടൽ',
    judgeDemo: 'ഡെമോ പരിസ്ഥിതി',
    runFullDemo: 'പൂർണ്ണ ഡെമോ പ്രവർത്തിപ്പിക്കുക',
    voiceToCapital: 'ശബ്ദത്തിൽ നിന്ന് മൂലധനം',
  },
};

/**
 * Generates immediate conversational voice feedback when merchant speech is recognized.
 */
export function getVoiceIntentAcknowledgement(
  amount: number,
  purpose: string,
  language: SupportedLanguage
): string {
  const formattedAmount = `₹${amount.toLocaleString('en-IN')}`;
  switch (language) {
    case 'Hinglish':
      return `Samajh gaya! Aapne ${purpose || 'business'} ke liye ${formattedAmount} ka working capital manga hai. Hum aapke dukaan ki cash flow aur eligibility check kar rahe hain.`;
    case 'Hindi':
      return `समझ गया! आपने ${purpose || 'व्यापार'} के लिए ${formattedAmount} के कार्यशील पूंजी ऋण का अनुरोध किया है। आपकी पात्रता की गणना की जा रही है।`;
    case 'Kannada':
      return `ಅರ್ಥವಾಯಿತು! ನೀವು ${purpose || 'ವ್ಯಾಪಾರ'}ಕ್ಕಾಗಿ ${formattedAmount} ದುಡಿಯುವ ಬಂಡವಾಳ ಸಾಲವನ್ನು ಕೇಳಿದ್ದೀರಿ. ನಿಮ್ಮ ಅಂಗಡಿಯ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.`;
    case 'Telugu':
      return `అర్థమైంది! మీరు ${purpose || 'వ్యాపారం'} కోసం ${formattedAmount} వర్కింగ్ క్యాపిటల్ రుణం కోరారు. మీ అర్హతను లెక్కిస్తున్నాము.`;
    case 'Tamil':
      return `புரிந்தது! நீங்கள் ${purpose || 'வணிகத்திற்காக'} ${formattedAmount} நடைமுறை மூலதன கடன் கோரியுள்ளீர்கள். தகுதியை மதிப்பீடு செய்கிறோம்.`;
    case 'Malayalam':
      return `മനസ്സിലായി! നിങ്ങൾ ${purpose || 'വ്യാപാരത്തിനായി'} ${formattedAmount} പ്രവർത്തന മൂലധന വായ്പ ആവശ്യപ്പെട്ടിരിക്കുന്നു. യോഗ്യത പരിശോധിക്കുന്നു.`;
    case 'English':
    default:
      return `Understood! You requested ${formattedAmount} working capital for ${purpose || 'commercial growth'}. Evaluating your store cash flow and safe credit ceiling now.`;
  }
}

/**
 * Generates celebratory voice announcement when loan application is submitted.
 */
export function getVoiceSubmissionAcknowledgement(
  appId: string,
  amount: number,
  language: SupportedLanguage
): string {
  const formattedAmount = `₹${amount.toLocaleString('en-IN')}`;
  switch (language) {
    case 'Hinglish':
      return `Badhai ho! Aapka ${formattedAmount} ka loan application safaltapoorvak submit ho gaya hai. Reference number ${appId}. Aapka paisa jald hi current account me transfer ho jayega.`;
    case 'Hindi':
      return `बधाई हो! आपका ${formattedAmount} का ऋण आवेदन सफलतापूर्वक जमा कर दिया गया है। संदर्भ संख्या ${appId}।`;
    case 'Kannada':
      return `ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ${formattedAmount} ಸಾಲದ ಅರ್ಜಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ${appId}.`;
    case 'Telugu':
      return `అభినందనలు! మీ ${formattedAmount} రుణ దరఖాస్తు విజయవంతంగా సమర్పించబడింది. రిఫరెన్స్ సంఖ్య ${appId}.`;
    case 'Tamil':
      return `வாழ்த்துக்கள்! உங்கள் ${formattedAmount} கடன் விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. குறிப்பு எண் ${appId}.`;
    case 'Malayalam':
      return `അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ ${formattedAmount} വായ്പാ അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു. റഫറൻസ് നമ്പർ ${appId}.`;
    case 'English':
    default:
      return `Congratulations! Your working capital application for ${formattedAmount} has been submitted successfully with reference ID ${appId}.`;
  }
}

/**
 * Generates voice acknowledgement for micro-insurance activation/claim
 */
export function getVoiceInsuranceAcknowledgement(
  productName: string,
  dailyPremium: number,
  language: SupportedLanguage,
  isClaim: boolean = false
): string {
  if (isClaim) {
    switch (language) {
      case 'Hinglish':
        return `${productName} ke liye aapka claim darj kar liya gaya hai. Spot advance ₹25,000 agle 2 ghante me aapke khate me transfer ho jayega.`;
      case 'Hindi':
        return `${productName} के लिए आपका दावा दर्ज कर लिया गया है। ₹25,000 की तत्काल सहायता आपके बैंक खाते में भेजी जा रही है।`;
      case 'Kannada':
        return `${productName} ಕ್ಲೇಮ್ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ. ₹25,000 ತ್ವರಿತ ಮುಂಗಡ ನಿಮ್ಮ ಖಾತೆಗೆ ಜಮೆಯಾಗಲಿದೆ.`;
      default:
        return `Your emergency insurance claim for ${productName} has been logged. An instant spot advance of ₹25,000 has been initiated to your settlement account.`;
    }
  }

  switch (language) {
    case 'Hinglish':
      return `${productName} suraksha shuru ho gayi hai! Rozana sirf ₹${dailyPremium} aapke sham ke QR settlement se katega. Dukaan ab 100% surakshit hai.`;
    case 'Hindi':
      return `${productName} सक्रिय कर दिया गया है। प्रतिदिन मात्र ₹${dailyPremium} आपके दैनिक क्यूआर सेटलमेंट से काटा जाएगा।`;
    case 'Kannada':
      return `${productName} ಯಶಸ್ವಿಯಾಗಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ! ದಿನಕ್ಕೆ ಕೇವಲ ₹${dailyPremium} ನಿಮ್ಮ ಕ್ಯೂಆರ್ ಸೆಟಲ್‌ಮೆಂಟ್‌ನಿಂದ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ.`;
    default:
      return `${productName} has been activated! A micro-premium of ₹${dailyPremium}/day will be deducted from your daily evening QR settlement.`;
  }
}

/**
 * Generates voice feedback when repayment mode is switched
 */
export function getVoiceRepaymentModeFeedback(
  mode: 'daily' | 'monthly',
  dailyAmount: number,
  monthlyAmount: number,
  language: SupportedLanguage
): string {
  if (mode === 'daily') {
    switch (language) {
      case 'Hinglish':
        return `Rozana Chhota Kist chuna gaya hai. Har shaam aapke QR collection se sirf ₹${dailyAmount} auto-split hoga. Mahine ke ant me koi bojh nahi!`;
      case 'Hindi':
        return `दैनिक छोटा किश्त चुना गया। प्रतिदिन शाम को ₹${dailyAmount} क्यूआर से कटेगा। महीने के अंत में कोई तनाव नहीं!`;
      case 'Kannada':
        return `ದೈನಂದಿನ ಸಣ್ಣ ಕಂತು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ. ದಿನಕ್ಕೆ ₹${dailyAmount} ನಿಮ್ಮ ಕ್ಯೂಆರ್ ಕಲೆಕ್ಷನ್‌ನಿಂದ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ.`;
      default:
        return `Daily QR Auto-Split selected. Only ₹${dailyAmount} will be auto-deducted daily from your QR settlements, eliminating end-of-month cash stress.`;
    }
  } else {
    switch (language) {
      case 'Hinglish':
        return `Standard Monthly EMI chuna gaya hai. ₹${monthlyAmount.toLocaleString('en-IN')} har mahine ki 5 tarikh ko NACH se kata jayega.`;
      default:
        return `Standard Monthly EMI selected: ₹${monthlyAmount.toLocaleString('en-IN')} will be deducted monthly via NACH on the 5th.`;
    }
  }
}

/**
 * Generates welcome voice announcement for newly onboarded merchants
 */
export function getVoiceWelcomeAcknowledgement(
  merchantName: string,
  businessName: string,
  language: SupportedLanguage
): string {
  switch (language) {
    case 'Hinglish':
      return `Welcome ${merchantName} ji! Aapki dukaan ${businessName} onboard ho chuki hai aur aap instant working capital loan ke liye pre-approved hain.`;
    case 'Hindi':
      return `नमस्ते ${merchantName} जी! आपकी दुकान ${businessName} को सफलतापूर्वक जोड़ लिया गया है और आप तुरंत वर्किंग कैपिटल लोन के लिए प्री-अप्रूव्ड हैं।`;
    case 'Kannada':
      return `ಸ್ವಾಗತ ${merchantName} ಅವರೇ! ನಿಮ್ಮ ಸಂಸ್ಥೆ ${businessName} ನೋಂದಣಿಯಾಗಿದೆ ಮತ್ತು ನೀವು ತಕ್ಷಣದ ವರ್ಕಿಂಗ್ ಕ್ಯಾಪಿಟಲ್ ಲೋನ್‌ಗೆ ಪೂರ್ವ-ಅನುಮೋದನೆ ಪಡೆದಿದ್ದೀರಿ.`;
    case 'Telugu':
      return `స్వాగతం ${merchantName} గారు! మీ వ్యాపారం ${businessName} విజయవంతంగా ఆన్‌బోర్డ్ చేయబడింది మరియు మీరు తక్షణ వర్కింగ్ క్యాపిటల్ లోన్‌కు ప్రీ-అప్రూవ్ అయ్యారు.`;
    case 'Tamil':
      return `வணக்கம் ${merchantName}! உங்கள் கடை ${businessName} வெற்றிகரமாக சேர்க்கப்பட்டது, நீங்கள் உடனடி பணி மூலதனக் கடனுக்கு முன்-அங்கீகரிக்கப்பட்டுள்ளீர்கள்.`;
    case 'Malayalam':
      return `സ്വാഗതം ${merchantName}! നിങ്ങളുടെ സ്ഥാപനമായ ${businessName} വിജയകരമായി ചേർത്തു, നിങ്ങൾക്ക് ഇൻസ്റ്റന്റ് വർക്കിംഗ് ക്യാപിറ്റൽ ലോൺ പ്രീ-അപ്രൂവ്ഡ് ആണ്.`;
    default:
      return `Welcome ${merchantName}! Your store ${businessName} has been onboarded and pre-approved for instant working capital.`;
  }
}

/**
 * Generates voice feedback when an EMI reschedule is confirmed
 */
export function getVoiceRescheduleAcknowledgement(
  strategyLabel: string,
  newDueDate: string,
  fee: number,
  language: SupportedLanguage
): string {
  switch (language) {
    case 'Hinglish':
      return `Aapka loan repayment reschedule ho gaya hai: ${strategyLabel}. Nayi tareekh ${newDueDate} hai. Fee sirf ₹${fee} lagi hai, aur CIBIL score bilkul surakshit hai!`;
    case 'Hindi':
      return `आपकी किश्त सफलतापूर्वक आगे बढ़ा दी गई है: ${strategyLabel}। नई तिथि ${newDueDate} है। शून्य पेनल्टी के साथ आपका सिबिल स्कोर सुरक्षित है।`;
    case 'Kannada':
      return `ನಿಮ್ಮ ಕಂತು ವಿಸ್ತರಣೆ ಯಶಸ್ವಿಯಾಗಿದೆ: ${strategyLabel}. ಹೊಸ ದಿನಾಂಕ ${newDueDate}. ನಿಮ್ಮ ಸಿಬಿಲ್ ಸ್ಕೋರ್ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿದೆ.`;
    case 'Tamil':
      return `உங்கள் தவணை வெற்றிகரமாக மாற்றியமைக்கப்பட்டது: ${strategyLabel}. புதிய தேதி ${newDueDate}. CIBIL மதிப்பெண் பாதுகாப்பானது.`;
    default:
      return `Your EMI has been rescheduled with ${strategyLabel}. The revised due date is ${newDueDate} with zero negative CIBIL impact.`;
  }
}

/**
 * Generates voice feedback when a failed payment is cured via instant UPI
 */
export function getVoiceCureAcknowledgement(
  amount: number,
  utr: string,
  language: SupportedLanguage
): string {
  switch (language) {
    case 'Hinglish':
      return `Bhugtan safal raha! ₹${amount.toLocaleString('en-IN')} prapt ho gaye hain. 100% bounce fee maaf kar di gayi hai aur loan account active hai. UTR: ${utr}.`;
    case 'Hindi':
      return `भुगतान सफल रहा! ₹${amount.toLocaleString('en-IN')} का भुगतान प्राप्त हुआ। 100% पेनल्टी माफ कर दी गई है।`;
    case 'Kannada':
      return `ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ₹${amount.toLocaleString('en-IN')} ಜಮೆಯಾಗಿದೆ ಮತ್ತು ದಂಡ ಶುಲ್ಕವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಮನ್ನಾ ಮಾಡಲಾಗಿದೆ.`;
    default:
      return `Payment successful! ₹${amount.toLocaleString('en-IN')} settled with 100% late fee waiver. Your account is in good standing. UTR: ${utr}.`;
  }
}
