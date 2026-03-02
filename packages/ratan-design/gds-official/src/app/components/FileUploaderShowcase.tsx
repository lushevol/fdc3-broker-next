import { useState } from 'react';
import {
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  X,
  Download,
  RefreshCw,
  Check,
  AlertCircle,
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  type: 'document' | 'image';
  preview?: string;
}

export default function FileUploaderShowcase() {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'quarterly-report-2024-Q4.pdf',
      size: '2.4 MB',
      status: 'success',
      type: 'document',
    },
    {
      id: '2',
      name: 'invoice-march-2024.xlsx',
      size: '856 KB',
      status: 'success',
      type: 'document',
    },
  ]);

  const [uploadingFile, setUploadingFile] = useState<UploadedFile | null>(null);
  const [errorFile, setErrorFile] = useState<UploadedFile | null>({
    id: '3',
    name: 'very-long-filename-that-needs-truncation-in-the-middle-section.zip',
    size: '45 MB',
    status: 'error',
    type: 'document',
  });

  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([
    {
      id: 'm1',
      name: 'mountain-landscape.jpg',
      size: '1.2 MB',
      status: 'success',
      type: 'image',
      preview:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    },
    {
      id: 'm2',
      name: 'forest-view.jpg',
      size: '980 KB',
      status: 'success',
      type: 'image',
      preview:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    },
    {
      id: 'm3',
      name: 'ocean-sunset.jpg',
      size: '1.1 MB',
      status: 'success',
      type: 'image',
      preview:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    },
  ]);

  const [boxHoverState, setBoxHoverState] = useState<
    'rest' | 'hover' | 'pressed'
  >('rest');

  const truncateFilename = (filename: string, maxLength: number = 35) => {
    if (filename.length <= maxLength) return filename;
    const ext = filename.split('.').pop() || '';
    const nameWithoutExt = filename.substring(
      0,
      filename.length - ext.length - 1,
    );
    const charsToShow = maxLength - ext.length - 4; // 4 for "..." and "."
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return `${nameWithoutExt.substring(0, frontChars)}…${nameWithoutExt.substring(nameWithoutExt.length - backChars)}.${ext}`;
  };

  const handleFileSelect = () => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: 'new-document-upload.pdf',
      size: '1.5 MB',
      status: 'uploading',
      progress: 0,
      type: 'document',
    };
    setUploadingFile(newFile);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadingFile(null);
        setFiles((prev) => [
          ...prev,
          { ...newFile, status: 'success', progress: 100 },
        ]);
      } else {
        setUploadingFile({ ...newFile, progress });
      }
    }, 200);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMediaDelete = (id: string) => {
    setMediaFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleRetry = () => {
    setErrorFile(null);
  };

  const getBoxStyles = () => {
    const baseStyles = {
      height: '140px',
      padding: '12px',
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: 'var(--sc-color-foundation-basic-divider-base)',
      borderRadius: '6px',
      backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      userSelect: 'none' as const,
    };

    if (boxHoverState === 'hover') {
      return {
        ...baseStyles,
        borderColor: 'var(--sc-color-blue-300)',
        backgroundColor: 'var(--sc-color-blue-25)',
      };
    } else if (boxHoverState === 'pressed') {
      return {
        ...baseStyles,
        borderColor: 'var(--sc-color-blue-500)',
        backgroundColor: 'var(--sc-color-blue-50)',
      };
    }
    return baseStyles;
  };

  return (
    <div>
      <h2
        style={{
          fontSize: 'var(--sc-text-section-main)',
          lineHeight: '44px',
          color: 'var(--sc-color-foundation-content-header)',
          marginBottom: '24px',
        }}
      >
        File uploader
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        The File Uploader lets users select, drag and drop, and manage files. It
        supports single and multiple uploads, progress indication, error
        handling, and post-upload actions.
      </p>

      {/* Upload Box States */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Upload box states
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Rest State */}
          <div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
                marginBottom: '8px',
              }}
            >
              Rest state
            </p>
            <div
              style={{
                height: '140px',
                padding: '12px',
                border:
                  '1px dashed var(--sc-color-foundation-basic-divider-base)',
                borderRadius: '6px',
                backgroundColor:
                  'var(--sc-color-foundation-basic-container-layer)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Upload size={32} style={{ color: 'var(--sc-color-grey-400)' }} />
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  Drag and drop files here or{' '}
                </span>
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-blue-500)',
                  }}
                >
                  Browse
                </span>
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Accepted: PNG, JPG, PDF · Max 25MB each · Up to 10 files
              </p>
            </div>
          </div>

          {/* Disabled State */}
          <div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
                marginBottom: '8px',
              }}
            >
              Disabled state
            </p>
            <div
              style={{
                height: '140px',
                padding: '12px',
                border: '1px dashed var(--sc-color-grey-200)',
                borderRadius: '6px',
                backgroundColor: 'var(--sc-color-grey-50)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
            >
              <Upload size={32} style={{ color: 'var(--sc-color-grey-300)' }} />
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  Drag and drop files here or{' '}
                </span>
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-grey-400)',
                  }}
                >
                  Browse
                </span>
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Accepted: PNG, JPG, PDF · Max 25MB each · Up to 10 files
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Upload Box */}
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '8px',
          }}
        >
          Interactive (hover and click to see states)
        </p>
        <div
          onClick={handleFileSelect}
          onMouseDown={() => setBoxHoverState('pressed')}
          onMouseUp={() => setBoxHoverState('hover')}
          onMouseEnter={() => setBoxHoverState('hover')}
          onMouseLeave={() => setBoxHoverState('rest')}
          style={getBoxStyles()}
        >
          <Upload
            size={32}
            style={{
              color:
                boxHoverState !== 'rest'
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-grey-400)',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
              }}
            >
              Drag and drop files here or{' '}
            </span>
            <span
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color:
                  boxHoverState !== 'rest'
                    ? 'var(--sc-color-blue-600)'
                    : 'var(--sc-color-blue-500)',
              }}
            >
              Browse
            </span>
          </div>
          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-helper-text)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Accepted: PNG, JPG, PDF · Max 25MB each · Up to 10 files
          </p>
        </div>
      </section>

      {/* Uploaded Items */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Uploaded items
        </h3>

        <div
          style={{
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
          }}
        >
          {/* Uploading file with progress */}
          {uploadingFile && (
            <div
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minHeight: '64px',
                borderBottom:
                  '1px solid var(--sc-color-foundation-basic-divider-base)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--sc-color-grey-100)',
                  borderRadius: '4px',
                }}
              >
                <FileText
                  size={20}
                  style={{ color: 'var(--sc-color-grey-600)' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {uploadingFile.name}
                </div>
                <div
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-foundation-content-helper-text)',
                    marginBottom: '6px',
                  }}
                >
                  {uploadingFile.size} · Uploading {uploadingFile.progress}%
                </div>
                <div
                  style={{
                    height: '4px',
                    backgroundColor: 'var(--sc-color-grey-100)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${uploadingFile.progress}%`,
                      backgroundColor: 'var(--sc-color-blue-500)',
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Uploaded files with success state */}
          {files.map((file, index) => (
            <div
              key={file.id}
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minHeight: '64px',
                borderBottom:
                  index < files.length - 1 || errorFile
                    ? '1px solid var(--sc-color-foundation-basic-divider-base)'
                    : 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-100)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--sc-color-grey-100)',
                    borderRadius: '4px',
                  }}
                >
                  <FileText
                    size={20}
                    style={{ color: 'var(--sc-color-grey-600)' }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sc-color-green-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--sc-color-white)',
                  }}
                >
                  <Check
                    size={8}
                    style={{ color: 'var(--sc-color-white)', strokeWidth: 3 }}
                  />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-blue-500)',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {truncateFilename(file.name)}
                </div>
                <div
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-foundation-content-helper-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{file.size}</span>
                  <span>·</span>
                  <span
                    style={{
                      color: 'var(--sc-color-blue-500)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Download size={12} />
                    Download
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.id);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-red-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} style={{ color: 'var(--sc-color-red-500)' }} />
              </button>
            </div>
          ))}

          {/* Error file with retry */}
          {errorFile && (
            <div
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minHeight: '64px',
                backgroundColor: 'var(--sc-color-red-25)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--sc-color-grey-100)',
                    borderRadius: '4px',
                  }}
                >
                  <FileText
                    size={20}
                    style={{ color: 'var(--sc-color-grey-600)' }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sc-color-red-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--sc-color-white)',
                  }}
                >
                  <X
                    size={8}
                    style={{ color: 'var(--sc-color-white)', strokeWidth: 3 }}
                  />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {truncateFilename(errorFile.name)}
                </div>
                <div
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-red-500)',
                  }}
                >
                  File too large. Max 25MB
                </div>
              </div>
              <button
                onClick={handleRetry}
                style={{
                  padding: '6px 16px',
                  flexShrink: 0,
                  border: '1px solid var(--sc-color-blue-500)',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-blue-500)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-blue-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                }}
              >
                <RefreshCw size={16} />
                Retry
              </button>
              <button
                onClick={() => setErrorFile(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-red-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} style={{ color: 'var(--sc-color-red-500)' }} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Uploaded Media */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Uploaded media
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          {mediaFiles.map((file) => (
            <div
              key={file.id}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '2px solid transparent',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-500)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-600)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-500)';
              }}
            >
              <img
                src={file.preview}
                alt={file.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMediaDelete(file.id);
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-red-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255, 255, 255, 0.95)';
                }}
              >
                <X size={16} style={{ color: 'var(--sc-color-red-500)' }} />
              </button>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'var(--sc-color-white)',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </div>
                <div
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    opacity: 0.8,
                  }}
                >
                  {file.size}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
