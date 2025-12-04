interface TextItem {
    str: string;
}

export async function extractTextFromPDF(file: File): Promise<string> {
    // Dynamically import pdfjs-dist to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker source
    // Note: We need to use type assertion because the type definition might not match the dynamic import perfectly
    const lib = pdfjsLib as typeof pdfjsLib & { GlobalWorkerOptions: { workerSrc: string } };
    lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => (item as TextItem).str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}
