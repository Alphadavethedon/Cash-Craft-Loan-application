import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Camera, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  User,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

enum KycStep {
  PERSONAL_INFO = 0,
  ID_VERIFICATION = 1,
  ADDRESS_VERIFICATION = 2,
  COMPLETION = 3,
}

const KycVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<KycStep>(KycStep.PERSONAL_INFO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { verifyKyc } = useAuth();
  const navigate = useNavigate();
  
  // Personal Info state
  const [personalInfo, setPersonalInfo] = useState({
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
  });
  
  // ID Verification state
  const [idVerification, setIdVerification] = useState({
    idType: 'national_id',
    idFrontUploaded: false,
    idBackUploaded: false,
    selfieUploaded: false,
  });
  
  // Address Verification state
  const [addressVerification, setAddressVerification] = useState({
    county: '',
    town: '',
    street: '',
    postalCode: '',
    documentType: 'utility_bill',
    documentUploaded: false,
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };
  
  const handleIdVerificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIdVerification({ ...idVerification, [name]: value });
  };
  
  const handleAddressVerificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressVerification({ ...addressVerification, [name]: value });
  };

  const simulateFileUpload = (field: string) => {
    setIsSubmitting(true);
    
    // Simulate file upload delay
    setTimeout(() => {
      if (field === 'idFront' || field === 'idBack' || field === 'selfie') {
        setIdVerification({
          ...idVerification,
          [`${field}Uploaded`]: true,
        });
      } else if (field === 'document') {
        setAddressVerification({
          ...addressVerification,
          documentUploaded: true,
        });
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => (prev + 1) as KycStep);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev - 1) as KycStep);
  };

  const handleCompleteKyc = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Combine all KYC data
      const kycData = {
        personalInfo,
        idVerification,
        addressVerification,
      };
      
      // Submit KYC data
      await verifyKyc(kycData);
      
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to complete KYC verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPersonalInfoComplete = () => {
    return (
      personalInfo.idNumber.trim() !== '' &&
      personalInfo.dateOfBirth.trim() !== '' &&
      personalInfo.gender.trim() !== '' &&
      personalInfo.occupation.trim() !== ''
    );
  };

  const isIdVerificationComplete = () => {
    return (
      idVerification.idFrontUploaded &&
      idVerification.idBackUploaded &&
      idVerification.selfieUploaded
    );
  };

  const isAddressVerificationComplete = () => {
    return (
      addressVerification.county.trim() !== '' &&
      addressVerification.town.trim() !== '' &&
      addressVerification.street.trim() !== '' &&
      addressVerification.postalCode.trim() !== '' &&
      addressVerification.documentUploaded
    );
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: KycStep.PERSONAL_INFO, label: 'Personal Info' },
            { step: KycStep.ID_VERIFICATION, label: 'ID Verification' },
            { step: KycStep.ADDRESS_VERIFICATION, label: 'Address' },
            { step: KycStep.COMPLETION, label: 'Complete' },
          ].map(({ step, label }) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep === step
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : currentStep > step
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{step + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  currentStep === step
                    ? 'text-emerald-600 font-medium dark:text-emerald-400'
                    : currentStep > step
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex items-center justify-between mt-3">
          <div className="absolute left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div
            className="absolute left-0 h-0.5 bg-emerald-500"
            style={{ width: `${(100 * currentStep) / 3}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderPersonalInfoStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Personal Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please provide your personal details to verify your identity.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              id="idNumber"
              name="idNumber"
              type="text"
              label="ID Number / Passport Number"
              placeholder="Enter your ID number"
              leftIcon={<CreditCard className="h-5 w-5 text-gray-400" />}
              value={personalInfo.idNumber}
              onChange={handlePersonalInfoChange}
              required
            />
          </div>
          
          <div>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              label="Date of Birth"
              value={personalInfo.dateOfBirth}
              onChange={handlePersonalInfoChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              value={personalInfo.gender}
              onChange={handlePersonalInfoChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Occupation
            </label>
            <select
              id="occupation"
              name="occupation"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              value={personalInfo.occupation}
              onChange={handlePersonalInfoChange}
              required
            >
              <option value="">Select occupation</option>
              <option value="employed">Employed</option>
              <option value="self_employed">Self-employed</option>
              <option value="business_owner">Business Owner</option>
              <option value="student">Student</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={!isPersonalInfoComplete()}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderIdVerificationStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">ID Verification</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please upload clear photos of your identification document and a selfie.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ID Type
          </label>
          <select
            id="idType"
            name="idType"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            value={idVerification.idType}
            onChange={handleIdVerificationChange}
          >
            <option value="national_id">National ID</option>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden">
            <div className="text-center p-4">
              <div className={`mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                idVerification.idFrontUploaded 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {idVerification.idFrontUploaded ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <CreditCard className="h-8 w-8" />
                )}
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Front of ID
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Upload a clear photo of the front of your ID
              </p>
              <Button
                variant={idVerification.idFrontUploaded ? "success" : "outline"}
                size="sm"
                onClick={() => simulateFileUpload('idFront')}
                isLoading={isSubmitting}
                leftIcon={idVerification.idFrontUploaded ? <CheckCircle className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              >
                {idVerification.idFrontUploaded ? 'Uploaded' : 'Upload'}
              </Button>
            </div>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="text-center p-4">
              <div className={`mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                idVerification.idBackUploaded 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {idVerification.idBackUploaded ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <CreditCard className="h-8 w-8" />
                )}
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Back of ID
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Upload a clear photo of the back of your ID
              </p>
              <Button
                variant={idVerification.idBackUploaded ? "success" : "outline"}
                size="sm"
                onClick={() => simulateFileUpload('idBack')}
                isLoading={isSubmitting}
                leftIcon={idVerification.idBackUploaded ? <CheckCircle className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              >
                {idVerification.idBackUploaded ? 'Uploaded' : 'Upload'}
              </Button>
            </div>
          </Card>
        </div>
        
        <Card className="overflow-hidden">
          <div className="text-center p-4">
            <div className={`mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              idVerification.selfieUploaded 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {idVerification.selfieUploaded ? (
                <CheckCircle className="h-8 w-8" />
              ) : (
                <Camera className="h-8 w-8" />
              )}
            </div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Selfie Verification
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Take a clear selfie of yourself holding your ID
            </p>
            <Button
              variant={idVerification.selfieUploaded ? "success" : "outline"}
              size="sm"
              onClick={() => simulateFileUpload('selfie')}
              isLoading={isSubmitting}
              leftIcon={idVerification.selfieUploaded ? <CheckCircle className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            >
              {idVerification.selfieUploaded ? 'Uploaded' : 'Take Selfie'}
            </Button>
          </div>
        </Card>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={!isIdVerificationComplete()}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderAddressVerificationStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Address Verification</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please provide your current address details and upload a proof of address.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              id="county"
              name="county"
              type="text"
              label="County/City"
              placeholder="e.g., Nairobi"
              leftIcon={<MapPin className="h-5 w-5 text-gray-400" />}
              value={addressVerification.county}
              onChange={handleAddressVerificationChange}
              required
            />
          </div>
          
          <div>
            <Input
              id="town"
              name="town"
              type="text"
              label="Town/Area"
              placeholder="e.g., Westlands"
              value={addressVerification.town}
              onChange={handleAddressVerificationChange}
              required
            />
          </div>
          
          <div>
            <Input
              id="street"
              name="street"
              type="text"
              label="Street/Building"
              placeholder="e.g., Moi Avenue, Apartment 5B"
              value={addressVerification.street}
              onChange={handleAddressVerificationChange}
              required
            />
          </div>
          
          <div>
            <Input
              id="postalCode"
              name="postalCode"
              type="text"
              label="Postal Code"
              placeholder="e.g., 00100"
              value={addressVerification.postalCode}
              onChange={handleAddressVerificationChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proof of Address Document
            </label>
            <select
              id="documentType"
              name="documentType"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              value={addressVerification.documentType}
              onChange={handleAddressVerificationChange}
            >
              <option value="utility_bill">Utility Bill</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="rental_agreement">Rental Agreement</option>
              <option value="tax_document">Tax Document</option>
            </select>
          </div>
          
          <Card className="overflow-hidden mt-4">
            <div className="text-center p-4">
              <div className={`mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                addressVerification.documentUploaded 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {addressVerification.documentUploaded ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <Upload className="h-8 w-8" />
                )}
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Upload Document
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Must be less than 3 months old and clearly show your name and address
              </p>
              <Button
                variant={addressVerification.documentUploaded ? "success" : "outline"}
                size="sm"
                onClick={() => simulateFileUpload('document')}
                isLoading={isSubmitting}
                leftIcon={addressVerification.documentUploaded ? <CheckCircle className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              >
                {addressVerification.documentUploaded ? 'Uploaded' : 'Upload Document'}
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={!isAddressVerificationComplete()}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderCompletionStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Ready to Submit
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You have completed all the required verification steps. Please review your information before submitting.
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Information
            </h4>
            <ul className="mt-2 pl-6 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>ID Number: {personalInfo.idNumber}</li>
              <li>Date of Birth: {personalInfo.dateOfBirth}</li>
              <li>Gender: {personalInfo.gender}</li>
              <li>Occupation: {personalInfo.occupation}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              ID Verification
            </h4>
            <ul className="mt-2 pl-6 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>ID Type: {idVerification.idType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
              <li>Front of ID: {idVerification.idFrontUploaded ? '✓ Uploaded' : 'Not uploaded'}</li>
              <li>Back of ID: {idVerification.idBackUploaded ? '✓ Uploaded' : 'Not uploaded'}</li>
              <li>Selfie: {idVerification.selfieUploaded ? '✓ Uploaded' : 'Not uploaded'}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Address Verification
            </h4>
            <ul className="mt-2 pl-6 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>County/City: {addressVerification.county}</li>
              <li>Town/Area: {addressVerification.town}</li>
              <li>Street/Building: {addressVerification.street}</li>
              <li>Postal Code: {addressVerification.postalCode}</li>
              <li>Document Type: {addressVerification.documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
              <li>Document: {addressVerification.documentUploaded ? '✓ Uploaded' : 'Not uploaded'}</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleCompleteKyc}
            isLoading={isSubmitting}
          >
            Submit Verification
          </Button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case KycStep.PERSONAL_INFO:
        return renderPersonalInfoStep();
      case KycStep.ID_VERIFICATION:
        return renderIdVerificationStep();
      case KycStep.ADDRESS_VERIFICATION:
        return renderAddressVerificationStep();
      case KycStep.COMPLETION:
        return renderCompletionStep();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderStepIndicator()}
      {renderCurrentStep()}
    </div>
  );
};

export default KycVerification;