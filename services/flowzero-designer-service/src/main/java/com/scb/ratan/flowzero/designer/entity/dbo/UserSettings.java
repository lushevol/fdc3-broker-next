package com.scb.ratan.flowzero.designer.entity.dbo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

/**
 * Stores user preference settings (e.g. Todo column visibility, navigation favourites).
 * The composite key (userId, type, name) is unique per user.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_user_settings", schema = DESIGNER_SCHEMA_NAME)
public class UserSettings extends AuditMetadata implements Serializable {

    private static final long serialVersionUID = -3124567890123456789L;

    /**
     * User Bank ID.
     */
    private String userId;

    /**
     * Settings scope identifier: TODO_COLUMNS or NAVIGATION_FAVOURITES.
     */
    private String type;

    /**
     * Unique name for this settings entry within (userId, type).
     */
    private String name;

    /**
     * Free-form JSON payload — structure depends on the type.
     */
    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String settings;

}

