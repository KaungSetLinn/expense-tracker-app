import React, { useRef, useEffect } from 'react';

const BootstrapModal = ({ successMessage, showModal, closeModal }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      modalRef.current.classList.add('fade');
      modalRef.current.style.display = 'block';
      setTimeout(() => {
        modalRef.current.classList.add('show');
      }, 50); // Adding slight delay to ensure proper transition
    } else {
      modalRef.current.classList.remove('show');
      setTimeout(() => {
        modalRef.current.classList.remove('fade');
        modalRef.current.style.display = 'none';
      }, 300); // Same duration as Bootstrap's modal fade transition
    }
  }, [showModal]);

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <div className={`modal`} tabIndex="-1" role="dialog" ref={modalRef}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">メッセージ</h1>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <img 
              src='/correct-mark.png'
              className="img-fluid"
              alt='mark-pic'
              width='70px'
            />
            <div className='mt-2 fw-bold'>
                {successMessage}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleCloseModal}>閉じる</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootstrapModal;
