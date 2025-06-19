import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  username: Yup.string().required('Required').min(3, 'Minimum 3 characters'),
  password: Yup.string().required('Required').min(6, 'Minimum 6 characters'),
});

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h1>Register</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await axios.post('/api/auth/register', values);
            alert('Registration successful! Please login.');
            navigate('/login');
          } catch (error) {
            alert('Error registering: ' + (error.response?.data?.message || error.message));
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label>Username</label>
              <Field name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
      <p className="text-center" style={{ marginTop: '10px', color: '#6b7280' }}>
        Already have an account? <a href="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Login</a>
      </p>
    </div>
  );
};

export default Register;