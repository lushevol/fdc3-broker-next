import { BookingEntityNameIdOptions } from './BookingEntity';
describe('BookingEntityNameIdOptions', () => {
    it('should have all required fields: label, value, and tag', () => {
        BookingEntityNameIdOptions.forEach((option) => {
            expect(option).toHaveProperty('label');
            expect(option).toHaveProperty('value');
            expect(option).toHaveProperty('tag');
        });
    });
    it('should not have empty or whitespace-only label, value', () => {
        BookingEntityNameIdOptions.forEach((option) => {
            expect(option.label.trim()).not.toBe('');
            expect(option.value.trim()).not.toBe('');
        });
    });
    
    it('should not have leading or trailing spaces in label, value, or tag', () => {
        BookingEntityNameIdOptions.forEach((option) => {
            expect(option.label).toBe(option.label.trim());
            expect(option.value).toBe(option.value.trim());
            expect(option.tag).toBe(option.tag.trim());
        });
    });
    it('should not have duplicate labels', () => {
        const labels = BookingEntityNameIdOptions.map((option) => option.label);
        const uniqueLabels = new Set(labels);
        expect(uniqueLabels.size).toBe(labels.length);
    });
    
    it('should have unique values for the "value" field', () => {
        const values = BookingEntityNameIdOptions.map((option) => option.value);
        const uniqueValues = new Set(values);
        expect(uniqueValues.size).toBe(values.length);
    });
});


