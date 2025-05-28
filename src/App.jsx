import React, { useEffect, useRef, useState, useMemo } from 'react';
import questionPaper from './questionPaper';

const PAGE_HEIGHT_PX = 1100;

function getMCQOptions(queOptions) {
  if (!Array.isArray(queOptions)) return [];
  return queOptions.map((optObj) => {
    const key = Object.keys(optObj).find((k) => k.endsWith('Text'));
    return optObj[key];
  });
}

const MCQOptions = ({ queOptions }) => (
  <ul className='mt-1 ml-4 list-disc text-[0.97rem]'>
    {getMCQOptions(queOptions).map((opt, i) => (
      <li key={i} className='mb-0.5'>
        {opt}
      </li>
    ))}
  </ul>
);

const AssertionReason = ({ assertion, reason, queOptions }) => (
  <div className='mt-1 ml-2 text-[0.97rem]'>
    <div>
      <span className='font-semibold'>Assertion:</span> {assertion}
    </div>
    <div>
      <span className='font-semibold'>Reason:</span> {reason}
    </div>
    {Array.isArray(queOptions) && <MCQOptions queOptions={queOptions} />}
  </div>
);

const InternalChoice = ({ internalChoice }) => (
  <div className='text-[0.97rem]'>
    <div className='font-semibold'>OR:</div> {internalChoice}
  </div>
);

const CaseStudySubparts = ({ subParts }) => (
  <div className='mt-2 ml-2'>
    <div className='font-semibold mb-1'>Case Study Subparts:</div>
    <ol className='list-decimal ml-4 space-y-2'>
      {subParts.map((sub, i) => (
        <li key={sub.subId || i} className='mb-0.5 pl-2'>
          <div className='flex items-start justify-between'>
            <span>
              {sub.queText}
              {sub.internalChoice && (
                <div className='text-[0.96rem] mt-1'>
                  <span className='font-semibold'>OR:</span> {sub.internalChoice}
                </div>
              )}
            </span>
            <span className='font-medium ml-2 whitespace-nowrap'>
              [{sub.queMarks} mark{sub.queMarks > 1 ? 's' : ''}]
            </span>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

const QuestionRow = React.forwardRef(({ question, number, marks }, ref) => (
  <tr ref={ref} className='font-times text-[0.98rem] leading-[1.35] bg-white' style={{ verticalAlign: 'top' }}>
    <td className='border border-[#222] px-3 py-2 text-center align-top w-[2.2rem] font-medium text-[1rem]'>
      {number}
    </td>
    <td className='border border-[#222] px-4 py-2 align-top font-times text-[0.98rem] bg-white'>
      <div className='pb-1'>{question.queText}</div>
      {question.queType === 'MCQ' && Array.isArray(question.queOptions) && (
        <MCQOptions queOptions={question.queOptions} />
      )}
      {question.queType === 'Assertion-Reason' && (
        <AssertionReason assertion={question.assertion} reason={question.reason} queOptions={question.queOptions} />
      )}
      {question.internalChoice && <InternalChoice internalChoice={question.internalChoice} />}
      {question.queType === 'Case Study' && Array.isArray(question.subParts) && (
        <CaseStudySubparts subParts={question.subParts} />
      )}
    </td>
    <td className='border border-[#222] px-3 py-2 text-center align-top w-[2.2rem] font-medium text-[1rem]'>{marks}</td>
  </tr>
));

const SectionTable = ({ sectionInfo, questions, showHeader }) => (
  <div className='mb-4.5'>
    {showHeader && (
      <>
        <div className='text-[1.12rem] font-bold mb-0.5 font-times text-[#1a1a1a] tracking-tight'>
          {sectionInfo.title}
        </div>
        <div className='italic text-[0.99rem] mb-2.5 text-[#222]'>{sectionInfo.instructions}</div>
      </>
    )}
    <table className='w-full border-collapse text-[0.98rem] mb-0 bg-white'>
      <thead>
        <tr>
          <th className='border border-[#222] px-2 py-2 w-[2.2rem] bg-[#f7f7f7] font-semibold text-[0.98rem]'>#</th>
          <th className='border border-[#222] px-4 py-2 text-left bg-[#f7f7f7] font-semibold text-[0.98rem]'>
            Question
          </th>
          <th className='border border-[#222] px-2 py-2 w-[2.2rem] bg-[#f7f7f7] font-semibold text-[0.98rem]'>Marks</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q) => (
          <QuestionRow key={q.id || q.number} question={q} number={q.number} marks={q.marksPerQuestion} />
        ))}
      </tbody>
    </table>
  </div>
);

const PageHeader = ({ questionPaper }) => (
  <header className='mb-4' style={{ fontFamily: '"Times New Roman", Times, serif' }}>
    <div className='flex flex-col items-center gap-1 mb-1.5'>
      <div className='w-full text-center text-[1.25rem] font-semibold uppercase tracking-tight text-[#181818] leading-tight'>
        {questionPaper.title}
      </div>
      <div className='w-full text-center text-[1rem] text-[#444] mt-0.5'>
        <span className='mr-1'>{questionPaper.class}</span>
        <span className='text-[#bbb] mx-1'>|</span>
        <span className='ml-1'>{questionPaper.session}</span>
      </div>
      <div className='w-full text-center text-[1rem] text-[#444] mt-0.5'>
        <span>{questionPaper.subject}</span>
        <span className='text-[#888] ml-1'>({questionPaper.paperCode})</span>
      </div>
      <div className='w-full flex flex-row items-center justify-between mt-2 px-1'>
        <div className='text-[0.98rem] text-[#2d2d2d]'>
          <span>Time Allowed:</span> {questionPaper.timeAllowed}
        </div>
        <div className='text-[0.98rem] text-[#2d2d2d]'>
          <span>Maximum Marks:</span> {questionPaper.maximumMarks}
        </div>
      </div>
    </div>
    <hr className='my-1 border-[#bbb]' />
    <div className='mt-2 mb-1'>
      <div className='font-semibold text-[1rem] mb-0.5'>General Instructions:</div>
      <ol className='list-decimal ml-5 text-[0.96rem] text-[#222]'>
        {Array.isArray(questionPaper.generalInstructions) &&
          questionPaper.generalInstructions.map((inst, i) => (
            <li key={i} className='mb-0.5'>
              {inst}
            </li>
          ))}
      </ol>
    </div>
  </header>
);

const PageFooter = ({ pageIndex }) => (
  <div className='absolute bottom-2 right-[18px] text-[0.92rem] text-[#888] font-times not-italic tracking-[0.2px]'>
    Page {pageIndex + 1}
  </div>
);

const QuestionPaper = () => {
  const containerRef = useRef(null);
  const [pages, setPages] = useState([]);
  const questionRefs = useRef([]);
  const pdfContentRef = useRef(null);

  const allQuestions = useMemo(() => {
    const questions = [];
    questionPaper.sections.forEach((section) => {
      section.questions.forEach((q) => {
        questions.push({
          ...q,
          sectionTitle: section.title,
          instructions: section.instructions,
          marksPerQuestion: section.marksPerQuestion,
          sectionKey: section.key,
        });
      });
    });
    return questions;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    questionRefs.current = questionRefs.current.slice(0, allQuestions.length);

    const pagesArr = [];
    let currentPage = {
      questions: [],
      height: 0,
    };

    const pageMaxHeight = (questionPaper.pageHeightPx || PAGE_HEIGHT_PX) - 120;

    allQuestions.forEach((question, idx) => {
      const qElem = questionRefs.current[idx];
      if (!qElem) return;

      const qHeight = qElem.offsetHeight;

      if (currentPage.height + qHeight > pageMaxHeight && currentPage.questions.length > 0) {
        pagesArr.push(currentPage);
        currentPage = {
          questions: [],
          height: 0,
        };
      }

      currentPage.questions.push({ ...question, number: idx + 1 });
      currentPage.height += qHeight;
    });

    if (currentPage.questions.length) {
      pagesArr.push(currentPage);
    }

    setPages(pagesArr);
  }, [allQuestions]);

  return (
    <div className='font-times text-[#111] min-h-screen bg-white pt-6 m-0'>
      <table ref={containerRef} className='font-times invisible absolute top-0 left-0 pointer-events-none'>
        <tbody>
          {allQuestions.map((question, idx) => (
            <QuestionRow
              key={question.id || idx}
              ref={(el) => (questionRefs.current[idx] = el)}
              question={question}
              number={idx + 1}
              marks={question.marksPerQuestion}
            />
          ))}
        </tbody>
      </table>
      <div ref={pdfContentRef}>
        {pages.map((page, pageIndex) => {
          const sectionsInPage = [];
          page.questions.forEach((q) => {
            if (!sectionsInPage.includes(q.sectionKey)) sectionsInPage.push(q.sectionKey);
          });

          return (
            <section
              key={pageIndex}
              className='max-w-[820px] mx-auto mb-8 bg-white border border-[#222] rounded-none px-[18px] pt-[18px] pb-8 min-h-[1100px] relative shadow-none'
              style={{ pageBreakAfter: 'always' }}>
              {pageIndex === 0 && <PageHeader questionPaper={questionPaper} />}
              <PageFooter pageIndex={pageIndex} />
              {sectionsInPage.map((sectionKey) => {
                const questionsInSection = page.questions.filter((q) => q.sectionKey === sectionKey);
                const showHeader = (() => {
                  if (pageIndex === 0) return true;
                  for (let i = 0; i < pageIndex; i++) {
                    if (pages[i].questions.some((q) => q.sectionKey === sectionKey)) return false;
                  }
                  return true;
                })();
                const sectionInfo = questionPaper.sections.find((s) => s.key === sectionKey);
                return (
                  <SectionTable
                    key={sectionKey}
                    sectionInfo={sectionInfo}
                    questions={questionsInSection}
                    showHeader={showHeader}
                  />
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPaper;
