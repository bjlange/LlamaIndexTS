---
sidebar_position: 3
---

# محرك الاستعلامات (QueryEngine)

`تمت ترجمة هذه الوثيقة تلقائيًا وقد تحتوي على أخطاء. لا تتردد في فتح طلب سحب لاقتراح تغييرات.`

يقوم محرك الاستعلامات بتجميع "Retriever" و "ResponseSynthesizer" في أنبوبة، والتي ستستخدم سلسلة الاستعلام لاسترداد العقد ومن ثم إرسالها إلى LLM لتوليد استجابة.

```typescript
const queryEngine = index.asQueryEngine();
const response = await queryEngine.query("سلسلة الاستعلام");
```

## محرك الاستعلام للأسئلة الفرعية

الفكرة الأساسية لمحرك الاستعلام للأسئلة الفرعية هي تقسيم استعلام واحد إلى استعلامات متعددة، والحصول على إجابة لكل من تلك الاستعلامات، ثم دمج تلك الإجابات المختلفة في استجابة واحدة متسقة للمستخدم. يمكنك أن تفكر فيها كتقنية "فكر في ذلك خطوة بخطوة" ولكن بتكرار مصادر البيانات الخاصة بك!

### البدء

أسهل طريقة لبدء تجربة محرك الاستعلام للأسئلة الفرعية هي تشغيل ملف subquestion.ts في [examples](https://github.com/run-llama/LlamaIndexTS/blob/main/examples/subquestion.ts).

```bash
npx ts-node subquestion.ts
```

"

### الأدوات

يتم تنفيذ محرك الاستعلام للأسئلة الفرعية باستخدام الأدوات. الفكرة الأساسية للأدوات هي أنها خيارات قابلة للتنفيذ لنموذج اللغة الكبيرة. في هذه الحالة، يعتمد محرك الاستعلام للأسئلة الفرعية على أداة QueryEngineTool، والتي كما تخمن هي أداة لتشغيل استعلامات على محرك الاستعلام. يتيح لنا ذلك إعطاء النموذج خيارًا للاستعلام عن وثائق مختلفة لأسئلة مختلفة على سبيل المثال. يمكنك أيضًا أن تتخيل أن محرك الاستعلام للأسئلة الفرعية يمكنه استخدام أداة تبحث عن شيء ما على الويب أو تحصل على إجابة باستخدام Wolfram Alpha.

يمكنك معرفة المزيد عن الأدوات من خلال الاطلاع على وثائق LlamaIndex Python https://gpt-index.readthedocs.io/en/latest/core_modules/agent_modules/tools/root.html

"

## مرجع واجهة برمجة التطبيق (API)

- [محرك استعلام الاسترجاع (RetrieverQueryEngine)](../../api/classes/RetrieverQueryEngine.md)
- [محرك استعلام السؤال الفرعي (SubQuestionQueryEngine)](../../api/classes/SubQuestionQueryEngine.md)
- [أداة محرك الاستعلام (QueryEngineTool)](../../api/interfaces/QueryEngineTool.md)