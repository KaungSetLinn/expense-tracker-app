import React, { useRef, useEffect } from 'react';

const DeleteModal = ({ showModal, closeModal, handleDelete }) => {
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

  return (
    <div className={`modal`} tabIndex="-1" role="dialog" ref={modalRef}>
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">削除確認</h1>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
                <span className='float-start'>削除しますか？</span>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeModal}>キャンセル</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>削除</button>
            </div>
            </div>
        </div>
    </div>
  );
};

export default DeleteModal;
