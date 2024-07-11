import * as React from 'react';
import { IFormProps, IFormData } from './IFormProps';
import { submitForm, getFormData, updateFormEntry, deleteFormEntry,deleteFormDataBeforeToday  } from './FormeService';import styles from './Forme.module.scss';
import Navbar from '../../Header/navbar';
import Footer from '../Footer/footer';
import * as Modal from 'react-modal';

export const Forme: React.FC<IFormProps> = ({ context }) => {
  const [formData, setFormData] = React.useState<IFormData>({
    id: 0,
    offre_title: '',
    short_description: '',
    deadline: new Date(),
    city: 'rabat',
    fileType: 'pdf',
    file: null,
    fileName: '',
    category: '',
    link: '',  fontStyle: 'normal',
    fontWeight: 'normal',
    fontColor: '#000000',


  });

  const [formEntries, setFormEntries] = React.useState<IFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {

    fetchFormData();

  }, []);



  const fetchFormData = async () => {

    try {

      await deleteFormDataBeforeToday(); 
      const formData = await getFormData();

      const modifiedFormData = formData.map(entry => ({

        ...entry,

        fileName: entry.fileUrl ? entry.fileUrl.substring(entry.fileUrl.lastIndexOf('/') ) : ''

      }));

      setFormEntries(modifiedFormData);



    } catch (error) {

      console.error('Error fetching form data:', error);

    }

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement) {
      if (name === 'deadline') {
        const date = new Date(value);
        setFormData(prevState => ({
          ...prevState,
          [name]: date,
        }));
      } else {
        setFormData(prevState => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData(prevState => ({
        ...prevState,
        file,
      }));
    }
  };

  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (formData.id) {
        await updateFormEntry(formData.id, formData);
      } else {
        await submitForm(formData);
      }
      setFormData({
        id: 0,
        offre_title: '',
        short_description: '',
        deadline: new Date(),
        city: 'rabat',
        fileType: 'pdf',
        file: null,
        fileName: '',
        category: '',
        link: '',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontColor: '#000000',

      });
      alert('Form submitted successfully!');
      fetchFormData();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntry = (entry: IFormData) => {
    setFormData(entry);
  };

  const handleDeleteEntry = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteFormEntry(id);
        alert('Form entry deleted successfully!');
        fetchFormData();
      } catch (error) {
        console.error('Error deleting form entry:', error);
        alert('An error occurred while deleting the form entry. Please try again.');
      }
    }
  };
  return (
    <>
      <div style={{ width: '100%', maxWidth: '9000px', margin: '0 auto', padding: '0 20px' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <div style={{ marginBottom: '50px' }}></div>
            <div style={{ position: 'relative' }}>
              <form className={styles.formContainer1} onSubmit={handleOpenModal}>
                <div className={styles.inputField}>
                  <input type="text1" id="offre_title" name="offre_title" value={formData.offre_title} onChange={handleInputChange} placeholder="Title" className={styles.OffreTitle} style={{ backgroundColor: '#F5F9FF', height: '40px', width: '709px' }} />
                </div>
                <span> </span>
                <div className={styles.inputField}>
                  <textarea id="short_description" name="short_description" value={formData.short_description} onChange={handleInputChange} placeholder="Short Description" style={{ backgroundColor: '#F5F9FF', width: '690px', height: '200px' }} className={styles.ShortDescription} />
                </div>
                <span> </span>
                <div className={styles.inputField}>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{ backgroundColor: '#F5F9FF', width: '700px', height: '40px' }}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Fonction Support">Fonction Support</option>
                    <option value="Tech">Tech</option>
                    <option value="CRM">CRM</option>
                  </select>
                </div>
                <span> </span>
                <div className={styles.inputField}>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="Enter a link"
                    style={{ backgroundColor: '#F5F9FF', height: '20px', width: '685px' }}              
                  />
                </div>

                <span>&nbsp;</span>
                <div className={styles.inputContainer}>
                  <div className={styles.inputField}>
                    <svg width="55" height="55" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 13.5C3 10.671 3 9.258 3.879 8.379C4.758 7.5 6.171 7.5 9 7.5H27C29.829 7.5 31.242 7.5 32.121 8.379C33 9.258 33 10.671 33 13.5C33 14.2065 33 14.5605 32.781 14.781C32.5605 15 32.205 15 31.5 15H4.5C3.7935 15 3.4395 15 3.219 14.781C3 14.5605 3 14.205 3 13.5ZM3 27C3 29.829 3 31.242 3.879 32.121C4.758 33 6.171 33 9 33H27C29.829 33 31.242 33 32.121 32.121C33 31.242 33 29.829 33 27V19.5C33 18.7935 33 18.4395 32.781 18.219C32.5605 18 32.205 18 31.5 18H4.5C3.7935 18 3.4395 18 3.219 18.219C3 18.4395 3 18.795 3 19.5V27Z" fill="#627FA9" />
                      <path d="M10.5 4.5V9M25.5 4.5V9" stroke="#627FA9" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline.toISOString().split('T')[0]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.inputField}>
                    <svg width="45" height="45" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.5003 19.6457C19.3676 19.6457 18.2813 19.1957 17.4804 18.3948C16.6795 17.5938 16.2295 16.5075 16.2295 15.3748C16.2295 14.2421 16.6795 13.1558 17.4804 12.3549C18.2813 11.554 19.3676 11.104 20.5003 11.104C21.633 11.104 22.7193 11.554 23.5203 12.3549C24.3212 13.1558 24.7712 14.2421 24.7712 15.3748C24.7712 15.9357 24.6607 16.4911 24.4461 17.0092C24.2314 17.5274 23.9168 17.9982 23.5203 18.3948C23.1237 18.7914 22.6529 19.1059 22.1347 19.3206C21.6165 19.5352 21.0612 19.6457 20.5003 19.6457ZM20.5003 3.4165C17.3288 3.4165 14.2871 4.6764 12.0445 6.91902C9.80188 9.16164 8.54199 12.2033 8.54199 15.3748C8.54199 24.3436 20.5003 37.5832 20.5003 37.5832C20.5003 37.5832 32.4587 24.3436 32.4587 15.3748C32.4587 12.2033 31.1988 9.16164 28.9561 6.91902C26.7135 4.6764 23.6719 3.4165 20.5003 3.4165Z" fill="#627FA9" />
                    </svg>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="rabat">Rabat</option>
                      <option value="fes">Fes</option>
                      <option value="rabat&fes">Rabat & Fes</option>
                    </select>

                  </div>
                  <div className={styles.inputField}>
                    <svg width="45" height="45" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M20.417 32.0832H14.5837C9.08428 32.0832 6.33387 32.0832 4.62616 30.374C2.91699 28.6663 2.91699 25.9159 2.91699 20.4165V14.5832C2.91699 9.0838 2.91699 6.33338 4.62616 4.62567C6.33387 2.9165 9.09887 2.9165 14.6274 2.9165C15.5112 2.9165 16.2184 2.9165 16.8149 2.9413C16.7959 3.05796 16.7857 3.17609 16.7857 3.29713L16.7712 7.43005C16.7712 9.02984 16.7712 10.4444 16.9243 11.5834C17.0905 12.8186 17.4712 14.0538 18.4803 15.063C19.4866 16.0692 20.7232 16.4513 21.9585 16.6175C23.0974 16.7707 24.512 16.7707 26.1118 16.7707H32.021C32.0837 17.5494 32.0837 18.5061 32.0837 19.7792V20.4165C32.0837 25.9159 32.0837 28.6663 30.3745 30.374C28.6668 32.0832 25.9164 32.0832 20.417 32.0832Z" fill="#627FA9" />
                      <path d="M28.2213 11.1082L22.4463 5.91219C20.8028 4.43198 19.9818 3.69115 18.9711 3.30469L18.958 7.29177C18.958 10.7291 18.958 12.4484 20.0255 13.5159C21.093 14.5834 22.8124 14.5834 26.2497 14.5834H31.4705C30.9426 13.5568 29.9947 12.7051 28.2213 11.1082Z" fill="#627FA9" />
                    </svg>
                    <select name="fileType" value={formData.fileType} onChange={handleInputChange} required>
                      <option value="pdf">PDF</option>
                      <option value="docx">DOCX</option>
                      <option value="xlsx">XLSX</option>
                    </select>
                  </div>
                </div>
                <span>&nbsp;</span>
                <div className={styles.inputContainer2}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={styles.inputField} style={{ marginRight: '20px' }}>
                      <label htmlFor="fileUpload" className={styles.uploadButton}>
                        Upload
                        <input
                          type="file"
                          accept=".pdf,.docx,.xlsx"
                          id="fileUpload"
                          onChange={handleFileChange}
                          required
                          style={{ display: 'none' }}
                        />
                        <svg width="20" height="20" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.25 18H15.75C16.3687 18 16.875 17.4937 16.875 16.875V11.25H18.6637C19.665 11.25 20.1712 10.035 19.4625 9.32625L14.2987 4.1625C14.1947 4.0582 14.071 3.97546 13.935 3.91901C13.7989 3.86255 13.653 3.8335 13.5056 3.8335C13.3583 3.8335 13.2124 3.86255 13.0763 3.91901C12.9402 3.97546 12.8166 4.0582 12.7125 4.1625L7.54875 9.32625C6.84 10.035 7.335 11.25 8.33625 11.25H10.125V16.875C10.125 17.4937 10.6312 18 11.25 18ZM6.75 20.25H20.25C20.8687 20.25 21.375 20.7562 21.375 21.375C21.375 21.9937 20.8687 22.5 20.25 22.5H6.75C6.13125 22.5 5.625 21.9937 5.625 21.375C5.625 20.7562 6.13125 20.25 6.75 20.25Z" fill="#193A6A" />
                        </svg>
                      </label>
                      <span style={{ marginLeft: '40px' }}>{formData.file ? formData.file.name : 'No file selected'}</span>
                    </div>

                    <div>
                      <button type="submit" className={styles.button} disabled={isSubmitting}>
                        Submit
                        <span style={{ marginLeft: '40px' }}>
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5664 10.0226L0.601308 19.7933L0.376323 0.70157L19.5664 10.0226Z" fill="#9EBBE3" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className={styles.modal} overlayClassName={styles.overlay}>
                <h2>Verify your details</h2>
                <div>
                  <p><strong>Title:</strong> {formData.offre_title}</p>
                  <p><strong>Short Description:</strong> {formData.short_description}</p>
                  <p><strong>Deadline:</strong> {formData.deadline.toDateString()}</p>
                  <p><strong>City:</strong> {formData.city}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Link</strong> {formData.link}</p>
                  <p><strong>File Type:</strong> {formData.fileType}</p>
                  <p><strong>File:</strong> {formData.file ? formData.file.name : 'No file selected'}</p>
                </div>
                <div className={styles.modalButtons}>
                  <button className={styles.modalButton1} onClick={handleCloseModal}> <svg
                    width="28"
                    height="28"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.2609 25.4956H4.25V19.4847L20.4496 3.28514C20.7152 3.01956 21.0755 2.87036 21.4512 2.87036C21.8268 2.87036 22.1871 3.01956 22.4527 3.28514L26.4605 7.29147C26.5922 7.42305 26.6967 7.57929 26.768 7.75127C26.8393 7.92325 26.876 8.10759 26.876 8.29377C26.876 8.47994 26.8393 8.66429 26.768 8.83627C26.6967 9.00825 26.5922 9.16449 26.4605 9.29606L10.2609 25.4956ZM4.25 28.329H29.75V31.1623H4.25V28.329Z" fill="#FEC46D" />
                  </svg>
                  </button>
                  <button className={styles.modalButton2} onClick={handleConfirmSubmit} disabled={isSubmitting}>Confirm & Submit</button>
                </div>
              </Modal>
              <div style={{ width: '100%', maxWidth: '9000px', margin: '0 auto' }}>
                <h2 className={styles.recordsTitle}>Records</h2>                <div className={styles.recordsContainer} >
                  {formEntries.map((entry, index) => (
                    <div key={index} className={styles.record}>
                      <div className={styles.recordField}>{entry.offre_title}</div>
                      <div className={styles.recordField}>{entry.short_description}</div>
                      <div className={styles.recordField}>{entry.deadline.toLocaleDateString()}</div>
                      <div className={styles.recordField}>{entry.city}</div>
                      <div className={styles.recordField}>{entry.category}</div>
                      <div className={styles.recordField}>{entry.link}</div>
                      <div className={styles.recordField}>
                        {entry.fileUrl ? (
                          <span onClick={() => window.open(entry.fileUrl, '_blank')}>
                            <svg width="28" height="28" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M20.417 32.0834H14.5837C9.08428 32.0834 6.33387 32.0834 4.62616 30.3742C2.91699 28.6665 2.91699 25.9161 2.91699 20.4167V14.5834C2.91699 9.08404 2.91699 6.33362 4.62616 4.62591C6.33387 2.91675 9.09887 2.91675 14.6274 2.91675C15.5112 2.91675 16.2184 2.91675 16.8149 2.94154C16.7959 3.05821 16.7857 3.17633 16.7857 3.29737L16.7712 7.43029C16.7712 9.03008 16.7712 10.4447 16.9243 11.5836C17.0905 12.8188 17.4712 14.054 18.4803 15.0632C19.4866 16.0695 20.7232 16.4515 21.9585 16.6178C23.0974 16.7709 24.512 16.7709 26.1118 16.7709H32.021C32.0837 17.5497 32.0837 18.5063 32.0837 19.7795V20.4167C32.0837 25.9161 32.0837 28.6665 30.3745 30.3742C28.6668 32.0834 25.9164 32.0834 20.417 32.0834Z" fill="#6CA8FF" />
                              <path d="M28.2213 11.1082L22.4463 5.91219C20.8028 4.43198 19.9818 3.69115 18.9711 3.30469L18.958 7.29177C18.958 10.7291 18.958 12.4484 20.0255 13.5159C21.093 14.5834 22.8124 14.5834 26.2497 14.5834H31.4705C30.9426 13.5568 29.9947 12.7051 28.2213 11.1082Z" fill="#6CA8FF" />
                            </svg>
                          </span>
                        ) : (
                          '-'
                        )}
                        <span className={styles.iconSpace}></span>
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 34 34"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => handleEditEntry(entry)}
                        >
                          <path d="M10.2609 25.4956H4.25V19.4847L20.4496 3.28514C20.7152 3.01956 21.0755 2.87036 21.4512 2.87036C21.8268 2.87036 22.1871 3.01956 22.4527 3.28514L26.4605 7.29147C26.5922 7.42305 26.6967 7.57929 26.768 7.75127C26.8393 7.92325 26.876 8.10759 26.876 8.29377C26.876 8.47994 26.8393 8.66429 26.768 8.83627C26.6967 9.00825 26.5922 9.16449 26.4605 9.29606L10.2609 25.4956ZM4.25 28.329H29.75V31.1623H4.25V28.329Z" fill="#FEC46D" />
                        </svg>
                        <span className={styles.iconSpace}></span>
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 42 42"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <path d="M33.25 7H27.125L25.375 5.25H16.625L14.875 7H8.75V10.5H33.25M10.5 33.25C10.5 34.1783 10.8687 35.0685 11.5251 35.7249C12.1815 36.3813 13.0717 36.75 14 36.75H28C28.9283 36.75 29.8185 36.3813 30.4749 35.7249C31.1313 35.0685 31.5 34.1783 31.5 33.25V12.25H10.5V33.25Z" fill="#FF5454" />
                        </svg>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '50px' }}></div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Forme;
