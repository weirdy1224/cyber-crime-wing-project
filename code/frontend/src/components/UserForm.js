import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  mobile: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  account_type: Yup.string().required('Required'),
  account_ownership: Yup.string().required('Required'),
  account_number: Yup.string().required('Required'),
  ncrp_ack_number: Yup.string().required('Required'),
  account_opening_year: Yup.string().required('Required'),
  id_proof_type: Yup.string().required('Required'),
});

const UserForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const formContainer = document.querySelector('.form-container');
    formContainer.classList.add('welcome-animation');
  }, []);

  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <div className="form-container">
      <h1>Raise Unfreeze Request</h1>
      <Formik
        initialValues={{
          name: '', mobile: '', email: '', address: '', account_type: '', account_ownership: '',
          account_number: '', ncrp_ack_number: '', account_opening_year: '', business_description: '',
          transaction_reason: '', id_proof_type: '', documents: null
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const formData = new FormData();
          Object.keys(values).forEach(key => {
            if (key === 'documents' && values[key]) {
              Array.from(values[key]).forEach(file => formData.append('documents', file));
            } else {
              formData.append(key, values[key]);
            }
          });
          try {
            console.log('Submitting form data:', values);
            const res = await axios.post('/api/requests/submit', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            });
            alert(`Request submitted! Reference Number: ${res.data.reference_number}`);
            resetForm();
          } catch (error) {
            console.error('Submission error:', error.response ? error.response.data : error.message);
            alert('Error submitting request: ' + (error.response?.data?.message || error.message));
          }
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label>Name</label>
              <Field name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <Field name="mobile" />
              <ErrorMessage name="mobile" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <Field name="address" />
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <Field as="select" name="account_type">
                <option value="">Select</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
                <option value="Merchant">Merchant</option>
                <option value="Escrow">Escrow</option>
              </Field>
              <ErrorMessage name="account_type" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Account Ownership</label>
              <Field as="select" name="account_ownership">
                <option value="">Select</option>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
                <option value="Company">Company</option>
                <option value="Nodal">Nodal</option>
              </Field>
              <ErrorMessage name="account_ownership" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <Field name="account_number" />
              <ErrorMessage name="account_number" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>NCRP Acknowledgement Number</label>
              <Field name="ncrp_ack_number" />
              <ErrorMessage name="ncrp_ack_number" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Account Opening Year</label>
              <Field name="account_opening_year" />
              <ErrorMessage name="account_opening_year" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Business/Job Description</label>
              <Field name="business_description" as="textarea" />
            </div>
            <div className="form-group">
              <label>Reason for Transaction</label>
              <Field name="transaction_reason" as="textarea" />
            </div>
            <div className="form-group">
              <label>ID Proof Type</label>
              <Field as="select" name="id_proof_type">
                <option value="">Select</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
              </Field>
              <ErrorMessage name="id_proof_type" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Upload Documents</label>
              <input
                type="file"
                multiple
                onChange={(event) => setFieldValue('documents', event.target.files)}
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;