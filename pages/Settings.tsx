import React, { useState } from 'react';
import { PageHeader, Card, Button, Badge } from '../components/UI';
import { ContentService, ClassService } from '../services/api';
import { HymnBook, Hymn, Member } from '../types';
import { Upload, FileJson, FileText, CheckCircle, AlertCircle, Users } from 'lucide-react';

const Settings: React.FC = () => {
  // Hymn Upload State
  const [targetBook, setTargetBook] = useState<HymnBook>('MHB');
  const [hymnFile, setHymnFile] = useState<File | null>(null);
  const [hymnUploading, setHymnUploading] = useState(false);
  const [hymnStatus, setHymnStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Member Upload State
  const [memberFile, setMemberFile] = useState<File | null>(null);
  const [memberUploading, setMemberUploading] = useState(false);
  const [memberStatus, setMemberStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // --- Hymn Handlers ---
  const handleHymnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHymnFile(e.target.files[0]);
      setHymnStatus(null);
    }
  };

  const handleHymnUpload = async () => {
    if (!hymnFile) return;
    setHymnUploading(true);
    setHymnStatus(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);

        if (!Array.isArray(json)) throw new Error('File content must be an array of hymns.');

        const newHymns: Hymn[] = json.map((item: any) => {
          let book: HymnBook = targetBook;
          if (item.book) {
             const b = String(item.book).trim();
             if (b === 'MHB' || b === 'CAN' || b === 'Canticles') book = b as HymnBook;
             else if (b === 'Canticle') book = 'Canticles';
          }

          return {
            id: `h_${book}_${item.number}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            book: book,
            number: String(item.number),
            title: item.title,
            lyrics: item.lyrics,
            category: item.category
          };
        });

        await ContentService.importHymns(newHymns);
        const countStr = newHymns.length; 
        setHymnStatus({ type: 'success', message: `Successfully imported ${countStr} hymns.` });
        setHymnFile(null);
      } catch (error: any) {
        setHymnStatus({ type: 'error', message: error.message || 'Failed to parse JSON file.' });
      } finally {
        setHymnUploading(false);
      }
    };
    reader.readAsText(hymnFile);
  };

  // --- Member Handlers ---
  const handleMemberFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMemberFile(e.target.files[0]);
      setMemberStatus(null);
    }
  };

  const handleMemberUpload = async () => {
    if (!memberFile) return;
    setMemberUploading(true);
    setMemberStatus(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split(/\r?\n/);
        
        // Skip header if present (Assuming first row is header if it contains 'name' or 'class')
        const dataRows = rows.filter(r => r.trim().length > 0);
        let startIndex = 0;
        if (dataRows[0].toLowerCase().includes('name') || dataRows[0].toLowerCase().includes('class')) {
            startIndex = 1;
        }

        const newMembers: Member[] = [];
        
        for (let i = startIndex; i < dataRows.length; i++) {
            const cols = dataRows[i].split(',').map(c => c.trim());
            // Expected CSV: Name, Class, MemberNumber, Phone (optional)
            if (cols.length < 3) continue;

            const [name, classId, memberNumber, phone] = cols;
            
            newMembers.push({
                id: `m_${classId}_${memberNumber}_${Date.now()}_${i}`,
                fullName: name,
                classId: classId,         // Assuming CSV contains Class ID e.g. "c1" or "Class 1"
                classNumber: memberNumber, // The member's specific number
                phone: phone || '',
                status: 'Active'
            });
        }

        if (newMembers.length === 0) throw new Error('No valid member records found.');

        await ClassService.importMembers(newMembers);
        setMemberStatus({ type: 'success', message: `Successfully imported ${newMembers.length} members into database.` });
        setMemberFile(null);
      } catch (error: any) {
        setMemberStatus({ type: 'error', message: error.message || 'Failed to parse CSV file.' });
      } finally {
        setMemberUploading(false);
      }
    };
    reader.readAsText(memberFile);
  };

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="grid gap-6">
        
        {/* --- Member Database Management (CSV) --- */}
        <section>
          <div className="flex items-center gap-2 mb-3 ml-1">
             <Users className="w-5 h-5 text-brand-600" />
             <h2 className="text-lg font-bold text-gray-900">Member Database</h2>
          </div>
          <Card className="p-6">
             <div className="mb-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                   Bulk upload members using a <strong>CSV file</strong>. This is useful for initializing class rosters.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 font-mono text-xs text-blue-900 overflow-x-auto">
                   <p className="text-blue-500 mb-1 select-none font-bold">// Expected CSV Format (Headers optional)</p>
                   <p>Name, Class, MemberNumber, Phone</p>
                   <p className="text-blue-400 mt-2">// Example</p>
                   <pre>John Doe, c1, 001, 0244123456</pre>
                   <pre>Jane Smith, c5, 102, 0200987654</pre>
                </div>
             </div>

             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CSV</label>
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                        <div className="relative group">
                            <input 
                                type="file" 
                                id="member-upload" 
                                accept=".csv" 
                                className="hidden" 
                                onChange={handleMemberFileChange}
                            />
                            <label 
                                htmlFor="member-upload" 
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                            >
                                <FileText className="w-4 h-4 text-gray-500" />
                                {memberFile ? 'Change File' : 'Select CSV File'}
                            </label>
                        </div>
                        {memberFile && <span className="text-sm text-gray-600 font-medium">{memberFile.name}</span>}
                    </div>
                </div>

                {memberStatus && (
                    <div className={`p-3 rounded-lg flex items-start gap-3 border ${memberStatus.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    {memberStatus.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                    <span className="text-sm">{memberStatus.message}</span>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <Button 
                        onClick={handleMemberUpload} 
                        disabled={!memberFile || memberUploading} 
                        isLoading={memberUploading}
                        variant="secondary"
                    >
                        Import Members
                    </Button>
                </div>
             </div>
          </Card>
        </section>

        {/* --- Hymn Data Management (JSON) --- */}
        <section>
          <div className="flex items-center gap-2 mb-3 ml-1">
             <FileJson className="w-5 h-5 text-purple-600" />
             <h2 className="text-lg font-bold text-gray-900">Hymn Data</h2>
          </div>
          <Card className="p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Default Hymn Book</label>
                <div className="flex flex-wrap gap-2">
                  {(['MHB', 'CAN', 'Canticles'] as HymnBook[]).map((book) => (
                    <button
                      key={book}
                      onClick={() => setTargetBook(book)}
                      className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                        targetBook === book
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {book}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload JSON</label>
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                    <div className="relative">
                        <input 
                            type="file" 
                            id="hymn-upload" 
                            accept=".json" 
                            className="hidden" 
                            onChange={handleHymnFileChange}
                        />
                        <label 
                            htmlFor="hymn-upload" 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                        >
                            <Upload className="w-4 h-4 text-gray-500" />
                            {hymnFile ? 'Change File' : 'Select JSON File'}
                        </label>
                    </div>
                    {hymnFile && <span className="text-sm text-gray-600 font-medium">{hymnFile.name}</span>}
                </div>
              </div>

              {hymnStatus && (
                <div className={`p-3 rounded-lg flex items-start gap-3 border ${hymnStatus.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                  {hymnStatus.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  <span className="text-sm">{hymnStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button onClick={handleHymnUpload} disabled={!hymnFile || hymnUploading} isLoading={hymnUploading}>
                  Import Hymns
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* General Settings */}
        <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 ml-1">General Settings</h2>
            <Card className="p-6">
                <div className="space-y-4 text-sm text-gray-500">
                    <div className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-700 text-base">App Theme</span>
                        <select className="border-gray-300 border rounded-lg p-2 bg-white text-base outline-none">
                            <option>Light System</option>
                            <option disabled>Dark (Pro)</option>
                        </select>
                    </div>
                </div>
            </Card>
        </section>
      </div>
    </div>
  );
};

export default Settings;