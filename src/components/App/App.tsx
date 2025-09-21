import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import type { ErrorResponse } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebounce } from '../Hooks/useDebounce';
import css from './App.module.css';
import { AxiosError } from 'axios';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
  queryKey: ['notes', page, debouncedSearch],
  queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
  placeholderData: () => ({
    notes: [],
    page,
    perPage: 12,
    totalPages: 1,
    totalNotes: 0,
  }),
  retry: (failureCount, err: AxiosError<ErrorResponse>) => {
    if (
      err.response?.status === 400 ||
      err.response?.status === 401 ||
      err.response?.status === 403
    ) {
      return false;
    }
    return failureCount < 3;
  },
});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={handleSearchChange} />
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </header>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={handleSearchChange} />
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </header>
        <ErrorMessage
          message={`Помилка завантаження нотаток: ${error?.response?.data?.message || error?.message || 'Невідома помилка'}`}
        />
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ['notes'] })}>
          Спробувати ще раз
        </button>
      </div>
    );
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length === 0 ? (
        <div className={css['no-notes-message']}>
          <p>Нотаток немає. Створіть свою першу нотатку!</p>
        </div>
      ) : (
        <NoteList notes={notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
