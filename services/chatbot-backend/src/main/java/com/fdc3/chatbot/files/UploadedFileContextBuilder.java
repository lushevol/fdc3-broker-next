package com.fdc3.chatbot.files;

import com.fdc3.chatbot.protocol.model.ProtocolPart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UploadedFileContextBuilder {
    private static final String FILE_PART_TYPE = "file";
    private static final String BASE64_ENCODING = "base64";

    private final UploadedFileRegistry uploadedFileRegistry;

    public String build(String conversationId, List<ProtocolPart> parts) {
        if (parts == null || parts.isEmpty()) {
            return "";
        }

        List<FileContextLine> fileContexts = new ArrayList<>();
        for (ProtocolPart part : parts) {
            if (part == null || !FILE_PART_TYPE.equals(part.getType())) {
                continue;
            }
            UploadedFile file = resolveFile(conversationId, part);
            Path localPath = materialize(file);
            fileContexts.add(new FileContextLine(file, localPath));
        }

        if (fileContexts.isEmpty()) {
            return "";
        }

        StringBuilder context = new StringBuilder();
        context.append("Uploaded files available for this conversation:\n");
        for (FileContextLine fileContext : fileContexts) {
            UploadedFile file = fileContext.file();
            context.append("- fileId: ").append(file.fileId()).append('\n');
            context.append("  name: ").append(file.name()).append('\n');
            context.append("  mimeType: ").append(file.mimeType()).append('\n');
            context.append("  sizeBytes: ").append(file.sizeBytes()).append('\n');
            context.append("  localPath: ").append(fileContext.localPath()).append('\n');
        }
        context.append('\n');
        context.append("Do not assume file contents are already extracted. ");
        context.append("If the user asks about PDF contents, invoke the pdf skill and use the localPath.");
        return context.toString();
    }

    private UploadedFile resolveFile(String conversationId, ProtocolPart part) {
        if (part.getData() != null && !part.getData().isBlank()) {
            if (!BASE64_ENCODING.equals(part.getEncoding())) {
                throw new IllegalArgumentException("File data requires base64 encoding");
            }
            byte[] bytes;
            try {
                bytes = Base64.getDecoder().decode(part.getData());
            } catch (IllegalArgumentException exception) {
                throw new IllegalArgumentException("Invalid base64 file data", exception);
            }
            return uploadedFileRegistry.store(conversationId, part.getName(), part.getMimeType(), bytes);
        }

        if (part.getFileId() != null && !part.getFileId().isBlank()) {
            return uploadedFileRegistry.find(part.getFileId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Uploaded file is no longer available: " + part.getFileId()));
        }

        throw new IllegalArgumentException("File part requires data or fileId");
    }

    private Path materialize(UploadedFile file) {
        try {
            return uploadedFileRegistry.materialize(file);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to materialize uploaded file " + file.fileId(), exception);
        }
    }

    private record FileContextLine(UploadedFile file, Path localPath) {
    }
}
