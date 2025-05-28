import React, { useEffect, useRef, useState, useMemo } from 'react';
import questionPaper from './questionPaper';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PAGE_HEIGHT_PX = A4_HEIGHT_PX;

const MCQOptions = ({ queOptions }) => (
  <ul className='mt-1 ml-4 list-disc text-[0.95rem]'>
    {(Array.isArray(queOptions)
      ? queOptions.map((optObj) => optObj[Object.keys(optObj).find((k) => k.endsWith('Text'))])
      : []
    ).map((opt, i) => (
      <li key={i} className='mb-0.5'>
        {opt}
      </li>
    ))}
  </ul>
);

const AssertionReason = ({ assertion, reason, queOptions }) => (
  <div className='mt-1 ml-2 text-[0.95rem]'>
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
  <div className='text-[0.95rem]'>
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
                <div className='text-[0.95rem] mt-1'>
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
  <tr ref={ref} className='font-times text-[0.96rem] leading-[1.32] bg-white' style={{ verticalAlign: 'top' }}>
    <td className='border border-[#222] px-2 py-1.5 text-center align-top w-[2rem] font-medium text-[0.98rem]'>
      {number}
    </td>
    <td className='border border-[#222] px-3 py-1.5 align-top font-times text-[0.96rem] bg-white'>
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
    <td className='border border-[#222] px-2 py-1.5 text-center align-top w-[2rem] font-medium text-[0.98rem]'>
      {marks}
    </td>
  </tr>
));

const SectionTable = ({ sectionInfo, questions, showHeader }) => (
  <div className='mb-4'>
    {showHeader && (
      <>
        <div className='text-[1.08rem] font-bold mb-0.5 font-times text-[#1a1a1a] tracking-tight'>
          {sectionInfo.title}
        </div>
        <div className='italic text-[0.97rem] mb-2 text-[#222]'>{sectionInfo.instructions}</div>
      </>
    )}
    <table className='w-full border-collapse text-[0.96rem] mb-0 bg-white'>
      <thead>
        <tr>
          {['#', 'Question', 'Marks'].map((h, i) => (
            <th
              key={h}
              className={`border border-[#222] ${
                i === 0 || i === 2 ? 'px-2 w-[2rem]' : 'px-3 text-left'
              } py-1.5 bg-[#f7f7f7] font-semibold text-[0.96rem]`}>
              {h}
            </th>
          ))}
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

const PageHeader = React.forwardRef(({ questionPaper }, ref) => (
  <header ref={ref} className='mb-3' style={{ fontFamily: '"Times New Roman", Times, serif' }}>
    <div className='flex flex-col items-center gap-1 mb-1'>
      <div className='w-full text-center text-[1.18rem] font-semibold uppercase tracking-tight text-[#181818] leading-tight'>
        {questionPaper.title}
      </div>
      <div className='w-full text-center text-[0.98rem] text-[#444] mt-0.5'>
        <span className='mr-1'>{questionPaper.class}</span>
        <span className='text-[#bbb] mx-1'>|</span>
        <span className='ml-1'>{questionPaper.session}</span>
      </div>
      <div className='w-full text-center text-[0.98rem] text-[#444] mt-0.5'>
        <span>{questionPaper.subject}</span>
        <span className='text-[#888] ml-1'>({questionPaper.paperCode})</span>
      </div>
      <div className='w-full flex flex-row items-center justify-between mt-2 px-1'>
        {['Time Allowed', 'Maximum Marks'].map((label, i) => (
          <div key={label} className='text-[0.96rem] text-[#2d2d2d]'>
            <span>{label}:</span> {i === 0 ? questionPaper.timeAllowed : questionPaper.maximumMarks}
          </div>
        ))}
      </div>
    </div>
    <hr className='my-1 border-[#bbb]' />
    <div className='mt-2 mb-1'>
      <div className='font-semibold text-[0.98rem] mb-0.5'>General Instructions:</div>
      <ol className='list-decimal ml-5 text-[0.94rem] text-[#222]'>
        {(Array.isArray(questionPaper.generalInstructions) ? questionPaper.generalInstructions : []).map((inst, i) => (
          <li key={i} className='mb-0.5'>
            {inst}
          </li>
        ))}
      </ol>
    </div>
  </header>
));

const PageFooter = ({ pageIndex }) => (
  <div
    className='absolute'
    style={{
      bottom: 12,
      right: 24,
      fontSize: '0.90rem',
      color: '#888',
      fontFamily: 'Times New Roman, Times, serif',
      letterSpacing: '0.2px',
      fontStyle: 'normal',
    }}>
    Page {pageIndex + 1}
  </div>
);

const QuestionPaper = () => {
  const containerRef = useRef(null);
  const [pages, setPages] = useState([]);
  const questionRefs = useRef([]);
  const pdfContentRef = useRef(null);
  const headerRef = useRef(null);

  const allQuestions = useMemo(
    () =>
      questionPaper.sections.flatMap((section) =>
        section.questions.map((q) => ({
          ...q,
          sectionTitle: section.title,
          instructions: section.instructions,
          marksPerQuestion: section.marksPerQuestion,
          sectionKey: section.key,
        }))
      ),
    []
  );

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight || 0);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    questionRefs.current = questionRefs.current.slice(0, allQuestions.length);
    const pagesArr = [];
    const pageMaxHeight = (questionPaper.pageHeightPx || PAGE_HEIGHT_PX) - 100;
    const firstPageMaxHeight = (questionPaper.pageHeightPx || PAGE_HEIGHT_PX) - headerHeight - 100;
    let isFirstPage = true,
      idx = 0;
    while (idx < allQuestions.length) {
      let availableHeight = isFirstPage ? firstPageMaxHeight : pageMaxHeight;
      let pageQuestions = [],
        pageHeight = 0;
      while (idx < allQuestions.length) {
        const qElem = questionRefs.current[idx];
        if (!qElem) break;
        const qHeight = qElem.offsetHeight;
        if (
          (pageHeight + qHeight > availableHeight && pageQuestions.length > 0) ||
          (qHeight > availableHeight && pageQuestions.length === 0) ||
          pageHeight + qHeight > availableHeight
        ) {
          if (qHeight > availableHeight && pageQuestions.length === 0) {
            pageQuestions.push({ ...allQuestions[idx], number: idx + 1 });
            pageHeight += qHeight;
            idx++;
          }
          break;
        }
        pageQuestions.push({ ...allQuestions[idx], number: idx + 1 });
        pageHeight += qHeight;
        idx++;
      }
      if (pageQuestions.length) pagesArr.push({ questions: pageQuestions, height: pageHeight });
      isFirstPage = false;
    }
    setPages(pagesArr);
  }, [allQuestions, headerHeight]);

  return (
    <div
      className='font-times text-[#111] min-h-screen bg-white pt-4 m-0'
      style={{ background: '#fff', minHeight: '100vh' }}>
      <div
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: `${A4_WIDTH_PX}px`,
          zIndex: -1,
        }}>
        <PageHeader ref={headerRef} questionPaper={questionPaper} />
      </div>
      <table
        ref={containerRef}
        className='font-times invisible absolute top-0 left-0 pointer-events-none'
        style={{ width: `${A4_WIDTH_PX - 48}px` }}>
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
          const sectionsInPage = [...new Set(page.questions.map((q) => q.sectionKey))];
          return (
            <section
              key={pageIndex}
              className='mx-auto mb-8 bg-white border border-[#222] rounded-none relative shadow-none'
              style={{
                maxWidth: `${A4_WIDTH_PX}px`,
                minHeight: `${A4_HEIGHT_PX}px`,
                width: `${A4_WIDTH_PX}px`,
                padding: '24px 24px 40px 24px',
                boxSizing: 'border-box',
                pageBreakAfter: 'always',
                position: 'relative',
              }}>
              {pageIndex === 0 && <PageHeader questionPaper={questionPaper} />}
              <PageFooter pageIndex={pageIndex} />
              {sectionsInPage.map((sectionKey) => {
                const questionsInSection = page.questions.filter((q) => q.sectionKey === sectionKey);
                const showHeader =
                  pageIndex === 0 ||
                  !pages.slice(0, pageIndex).some((p) => p.questions.some((q) => q.sectionKey === sectionKey));
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
